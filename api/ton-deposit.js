import { upsertUser } from '../src/storage.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }
  const { amount, comment } = req.body || {};
  if (!amount || !comment) return res.status(400).send('Invalid payload');
  const nano = Number(amount);
  if (nano >= 10 * 1_000_000_000) {
    const tgId = Number(comment.trim());
    if (!Number.isNaN(tgId)) {
      await upsertUser({ id: tgId, verified: true, depositAmount: nano });
    }
  }
  res.send('ok');
} 