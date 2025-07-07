import { getUser, upsertUser } from '../src/storage.js';
import { isAdmin } from '../src/config.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }
  const { id, address } = req.body || {};
  const numId = Number(id);
  if (!numId || !address) return res.status(400).json({ error: 'Missing id or address' });

  // very naive addr validation
  if (!/^[EU][A-Za-z0-9_-]{46,48}$/.test(address)) {
    return res.status(400).json({ error: 'Invalid TON address' });
  }

  const user = await getUser(numId);
  if (!user || (!user.verified && !isAdmin({ id: numId, username: '' }))) {
    return res.status(403).json({ error: 'Not verified' });
  }
  const earnedNano = user.earned || 0;
  if (earnedNano === 0) return res.status(400).json({ error: 'Nothing to withdraw' });

  // TODO: integrate real transfer; for now pretend success and reset earnings
  await upsertUser({ id: numId, earned: 0 });
  const withdrawnTon = earnedNano / 1_000_000_000;
  res.json({ withdrawn: withdrawnTon });
} 