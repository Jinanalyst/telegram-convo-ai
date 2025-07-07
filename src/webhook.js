import express from 'express';
import bodyParser from 'body-parser';
import { WEBHOOK_PORT } from './config.js';
import { upsertUser, getUser, incrementMessage, addEarnings } from './storage.js';
import { chatWithAI } from './ai.js';
import { REWARD_TON } from './config.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { generateQrPng } from './utils/qr.js';
import { isAdmin } from './config.js';

const app = express();
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static Telegram Mini App
app.use(express.static(join(__dirname, '../webapp')));

// Example payload expected from TON console webhook
// {
//   "amount": "10000000000", // nano ton
//   "comment": "123456789"   // telegram ID
// }

app.post('/webhook/ton/deposit', async (req, res) => {
  const { amount, comment } = req.body || {};
  if (!amount || !comment) {
    return res.status(400).send('Invalid payload');
  }
  const nano = Number(amount);
  if (nano >= 10 * 1_000_000_000) {
    const tgId = Number(comment.trim());
    if (!Number.isNaN(tgId)) {
      await upsertUser({ id: tgId, verified: true, depositAmount: nano });
      console.log('Deposit verified via webhook for', tgId);
    }
  }
  res.send('ok');
});

// API: get user status
app.get('/api/status/:id', async (req, res) => {
  const id = Number(req.params.id);
  const user = await getUser(id);
  if (!user) {
    const adminFlag = isAdmin({ id, username: '' });
    return res.json({ verified: adminFlag, earned: 0, messages: 0 });
  }
  res.json({ verified: !!user.verified || isAdmin(user), earned: (user.earned || 0) / 1_000_000_000, messages: user.messages || 0 });
});

// API: chat endpoint
app.post('/api/chat', async (req, res) => {
  const { id, message } = req.body || {};
  if (!id || !message) return res.status(400).send('Missing id or message');

  const user = await getUser(id);
  if ((!user || !user.verified) && !isAdmin({ id, username: '' })) {
    return res.status(403).send('Not verified');
  }

  const reply = await chatWithAI(message, id);

  await incrementMessage(id);
  const rewardNano = REWARD_TON * 1_000_000_000;
  const total = await addEarnings(id, rewardNano);

  res.json({ reply, reward: REWARD_TON, totalEarned: total / 1_000_000_000 });
});

// QR route
app.get('/qr.png', (req, res) => {
  const buffer = generateQrPng('UQCpjI3LzlAcvJz_4d1q1AiT5CJVY1onmpBsNO-7yEpZJyU8');
  res.setHeader('Content-Type', 'image/png');
  res.send(buffer);
});

export function startWebhookServer() {
  app.listen(WEBHOOK_PORT, () => {
    console.log('Webhook server listening on port', WEBHOOK_PORT);
  });
} 