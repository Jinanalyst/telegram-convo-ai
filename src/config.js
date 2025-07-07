import dotenv from 'dotenv';
dotenv.config();

export const BOT_TOKEN = process.env.BOT_TOKEN;
export const TON_WALLET = process.env.TON_WALLET;
export const TON_API_KEY = process.env.TON_API_KEY || '';
export const ADMIN_IDS = process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(',').map((id) => id.trim()) : [];
export const MSG_THRESHOLD = Number(process.env.MSG_THRESHOLD || 10); // messages per reward
export const REWARD_TON = Number(process.env.REWARD_TON || 0.05); // TON per message
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
export const WEBHOOK_PORT = Number(process.env.WEBHOOK_PORT || 3000);
export const WEBAPP_URL = process.env.WEBAPP_URL || 'https://your-domain.com';

if (!BOT_TOKEN) {
  console.error('Error: BOT_TOKEN is required in .env');
  process.exit(1);
} 