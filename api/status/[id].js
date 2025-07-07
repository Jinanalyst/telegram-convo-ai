import { getUser } from '../../src/storage.js';
import { isAdmin } from '../../src/config.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }
  const { id } = req.query;
  const numId = Number(id);
  if (!numId || Number.isNaN(numId)) {
    return res.json({ verified: false, earned: 0, messages: 0 });
  }
  const user = await getUser(numId);
  const verified = (user && user.verified) || isAdmin({ id: numId, username: '' });
  const earned = user ? (user.earned || 0) / 1_000_000_000 : 0;
  const messages = user ? user.messages || 0 : 0;
  res.json({ verified, earned, messages });
} 