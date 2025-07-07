import { getUser, incrementMessage, addEarnings } from '../src/storage.js';
import { isAdmin, REWARD_TON } from '../src/config.js';
import { chatWithAI } from '../src/ai.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }
  const { id, message } = req.body || {};
  if (!id || !message) return res.status(400).send('Missing id or message');
  const numId = Number(id);
  let user = await getUser(numId);
  const adminFlag = isAdmin({ id: numId, username: '' });
  if (!adminFlag && (!user || !user.verified)) {
    return res.status(403).send('Not verified');
  }
  const aiReply = await chatWithAI(message, id);
  await incrementMessage(numId);
  const rewardNano = REWARD_TON * 1_000_000_000;
  const total = await addEarnings(numId, rewardNano);
  res.json({ reply: aiReply, reward: REWARD_TON, totalEarned: total / 1_000_000_000 });
} 