import TonWeb from 'tonweb';
import { TON_WALLET, TON_API_KEY } from './config.js';

// 1 TON = 1e9 nano-TON
export const TEN_TON_NANO = 10 * 1_000_000_000;

const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', { apiKey: TON_API_KEY }));

export async function fetchTransactions(limit = 40) {
  const txs = await tonweb.provider.call('getTransactions', {
    address: TON_WALLET,
    limit,
  });
  return txs || [];
}

export function findUserDeposit(transactions, telegramId, minAmountNano = TEN_TON_NANO) {
  return transactions.find((tx) => {
    const msg = tx.in_msg;
    if (!msg) return false;
    const comment = msg.message || msg.comment || '';
    const amountNano = Number(msg.value || 0);
    return comment.includes(String(telegramId)) && amountNano >= minAmountNano;
  });
} 