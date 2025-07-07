import { isAdmin } from './config.js';

// decide storage backend
const useKV = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

let kvClient = null;
if (useKV) {
  const kvMod = await import('@vercel/kv');
  kvClient = kvMod.kv;
}

// LowDB fallback for local dev
let db = null;
let dbReady = false;
async function initLowDb() {
  if (dbReady) return;
  const { Low } = await import('lowdb');
  const { JSONFile } = await import('lowdb/node');
  const { promises: fs } = await import('fs');
  const { join, dirname } = await import('path');
  const { fileURLToPath } = await import('url');
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const dataDir = join(__dirname, '../data');
  await fs.mkdir(dataDir, { recursive: true });
  const file = join(dataDir, 'db.json');
  const adapter = new JSONFile(file);
  db = new Low(adapter, { users: [] });
  await db.read();
  dbReady = true;
}

// Helper functions for KV
async function kvGetUser(id) {
  const json = await kvClient.get(`user:${id}`);
  return json ? JSON.parse(json) : null;
}

async function kvSetUser(user) {
  await kvClient.set(`user:${user.id}`, JSON.stringify(user));
}

// Public API
export async function getUser(id) {
  if (useKV) return kvGetUser(id);
  await initLowDb();
  return db.data.users.find((u) => u.id === id);
}

export async function upsertUser(user) {
  if (useKV) {
    const existing = (await kvGetUser(user.id)) || { messages: 0, earned: 0 };
    const verifiedFlag = isAdmin(user) || user.verified || existing.verified;
    const merged = { ...existing, ...user, verified: verifiedFlag };
    await kvSetUser(merged);
    return;
  }
  await initLowDb();
  const idx = db.data.users.findIndex((u) => u.id === user.id);
  if (idx === -1) {
    const verifiedFlag = isAdmin(user) || user.verified;
    db.data.users.push({ messages: 0, earned: 0, verified: verifiedFlag, ...user });
  } else {
    db.data.users[idx] = { ...db.data.users[idx], ...user };
  }
  await db.write();
}

export async function getVerifiedUsers() {
  if (useKV) {
    // not efficient; for admin only in local env we keep LowDB.
    return [];
  }
  await initLowDb();
  return db.data.users.filter((u) => u.verified);
}

export async function incrementMessage(id) {
  if (useKV) {
    const user = (await kvGetUser(id)) || { id, messages: 0, earned: 0, verified: isAdmin({ id }) };
    user.messages = (user.messages || 0) + 1;
    await kvSetUser(user);
    return user.messages;
  }
  await initLowDb();
  const user = db.data.users.find((u) => u.id === id);
  if (user) {
    user.messages = (user.messages || 0) + 1;
    await db.write();
    return user.messages;
  }
  return 0;
}

export async function addEarnings(id, amountNano) {
  if (useKV) {
    const user = (await kvGetUser(id)) || { id, messages: 0, earned: 0, verified: isAdmin({ id }) };
    user.earned = (user.earned || 0) + amountNano;
    await kvSetUser(user);
    return user.earned;
  }
  await initLowDb();
  const user = db.data.users.find((u) => u.id === id);
  if (user) {
    user.earned = (user.earned || 0) + amountNano;
    await db.write();
    return user.earned;
  }
  return 0;
} 