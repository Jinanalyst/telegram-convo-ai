import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { isAdmin } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure data directory exists
const dataDir = join(__dirname, '../data');
await fs.mkdir(dataDir, { recursive: true });

const file = join(dataDir, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter, { users: [] });

await db.read();

export async function getUser(id) {
  await db.read();
  return db.data.users.find((u) => u.id === id);
}

export async function upsertUser(user) {
  await db.read();
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
  await db.read();
  return db.data.users.filter((u) => u.verified);
}

export async function incrementMessage(id) {
  await db.read();
  const user = db.data.users.find((u) => u.id === id);
  if (user) {
    user.messages = (user.messages || 0) + 1;
    await db.write();
    return user.messages;
  }
  return 0;
}

export async function addEarnings(id, amountNano) {
  await db.read();
  const user = db.data.users.find((u) => u.id === id);
  if (user) {
    user.earned = (user.earned || 0) + amountNano;
    await db.write();
    return user.earned;
  }
  return 0;
} 