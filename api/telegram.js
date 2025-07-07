import bot from '../src/bot.js';
import { Readable } from 'stream';

export const config = {
  runtime: 'nodejs',
};

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send('OK');
  }
  const raw = await getRawBody(req);
  const body = raw ? JSON.parse(raw) : {};
  try {
    await bot.handleUpdate(body, res);
    if (!res.headersSent) res.send('OK');
  } catch (err) {
    console.error('Telegram webhook error', err);
    res.status(500).send('Error');
  }
} 