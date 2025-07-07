import { Telegraf, Markup } from 'telegraf';
import { BOT_TOKEN, TON_WALLET, REWARD_TON, WEBAPP_URL, API_BASE_URL, isAdmin } from './config.js';
import { getUser, upsertUser, getVerifiedUsers, incrementMessage, addEarnings } from './storage.js';
import { fetchTransactions, findUserDeposit, TEN_TON_NANO } from './ton.js';
import { generateQrPng } from './utils/qr.js';
import { chatWithAI } from './ai.js';

const bot = new Telegraf(BOT_TOKEN);

// /start command
bot.start(async (ctx) => {
  const tgId = ctx.from.id;
  let user = await getUser(tgId);
  const adminFlag = isAdmin(ctx.from);
  if (!user) {
    user = { id: tgId, verified: adminFlag };
    await upsertUser({ ...user, username: ctx.from.username });
  }

  if (adminFlag && !user.verified) {
    user.verified = true;
    await upsertUser({ id: tgId, verified: true });
  }

  if (user.verified) {
    await ctx.reply('✅ You are already verified! Enjoy Convoai.', {
      ...Markup.inlineKeyboard([
        Markup.button.webApp('💬 Start Chatting', `${WEBAPP_URL}?api=${encodeURIComponent(API_BASE_URL)}&uid=${tgId}`),
      ]),
    });
    return;
  }

  const caption = `👋 Welcome to <b>Convoai</b>\n\nTo unlock chat-to-earn, please deposit <b>10 TON</b> or more to the wallet below (static):\n\n<code>${TON_WALLET}</code>\n\nInclude <b>your Telegram ID</b> (${tgId}) in the transaction comment for faster verification.`;

  const qrBuffer = generateQrPng(TON_WALLET);

  try {
    await ctx.replyWithPhoto({ source: qrBuffer }, {
      caption,
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        Markup.button.callback('✅ Check Deposit', 'CHECK_DEPOSIT'),
        Markup.button.webApp('💬 Start Chatting', `${WEBAPP_URL}?api=${encodeURIComponent(API_BASE_URL)}&uid=${tgId}`),
      ]),
    });
  } catch (err) {
    console.error('Telegram send error:', err);
    await ctx.reply('Welcome! (Failed to send QR code, please contact admin.)');
  }
});

// Manual check button
bot.action('CHECK_DEPOSIT', async (ctx) => {
  await ctx.answerCbQuery('Checking deposit…');
  const tgId = ctx.from.id;
  const txs = await fetchTransactions();
  const deposit = findUserDeposit(txs, tgId, TEN_TON_NANO);

  if (deposit) {
    await upsertUser({ id: tgId, verified: true, txHash: deposit.transaction_id.hash });
    await ctx.reply('🎉 Deposit verified! You now have full access.');
  } else {
    await ctx.reply('❌ Deposit not found yet. Please wait for confirmations and try again\.');
  }
});

// Admin command to list verified users
bot.command('admin_verified', async (ctx) => {
  if (!ADMIN_IDS.includes(String(ctx.from.id))) return;
  const users = await getVerifiedUsers();
  const msg = users.length ? users.map((u) => `• ${u.id} – ${u.txHash || ''}`).join('\n') : 'No verified users yet\.';
  await ctx.reply(msg);
});

// /check command (same as button)
bot.command('check', async (ctx) => {
  const tgId = ctx.from.id;
  await ctx.reply('🔍 Checking deposit, please wait…');
  const txs = await fetchTransactions();
  const deposit = findUserDeposit(txs, tgId, TEN_TON_NANO);
  if (deposit) {
    await upsertUser({ id: tgId, verified: true, txHash: deposit.transaction_id.hash });
    await ctx.reply('🎉 Deposit verified! You now have full access.');
  } else {
    await ctx.reply('❌ Deposit not found yet. Please wait for confirmations and try again.');
  }
});

// /chat command (just confirms access)
bot.command('chat', async (ctx) => {
  const user = await getUser(ctx.from.id);
  if (user?.verified) {
    await ctx.reply('🗨️ Chat unlocked! Send messages and start earning.');
  } else {
    await ctx.reply('❌ You need to deposit 10 TON first. Use /start to see instructions.');
  }
});

// /rewards command
bot.command('rewards', async (ctx) => {
  const user = await getUser(ctx.from.id);
  if (!user) return ctx.reply('No data found.');
  const earnedTon = (user.earned || 0) / 1_000_000_000;
  await ctx.reply(`💰 You have sent ${user.messages || 0} messages and earned ${earnedTon} TON so far.`);
});

// Text message handler for chat-to-earn
bot.on('text', async (ctx, next) => {
  const tgId = ctx.from.id;
  const user = await getUser(tgId);
  if (!user?.verified) {
    await ctx.reply('🔒 Please complete the 10 TON deposit first. Use /start.');
    return;
  }

  const count = await incrementMessage(tgId);
  const rewardNano = REWARD_TON * 1_000_000_000;
  const totalEarned = await addEarnings(tgId, rewardNano);
  const totalTon = totalEarned / 1_000_000_000;

  await ctx.replyWithChatAction('typing');
  const aiReply = await chatWithAI(ctx.message.text, tgId);
  if (aiReply) {
    await ctx.reply(aiReply + `\n\n💰 (+${REWARD_TON} TON, total ${totalTon} TON)`);
  } else {
    await ctx.reply(`💰 You earned ${REWARD_TON} TON! (total ${totalTon} TON)`);
  }

  await next();
});

// Admin list users command
bot.command('admin_users', async (ctx) => {
  if (!ADMIN_IDS.includes(String(ctx.from.id))) return;
  const users = await getVerifiedUsers();
  const msg = users.length ? users.map((u) => `• ${u.id} | msgs:${u.messages || 0} | earned:${(u.earned || 0) / 1_000_000_000}`).join('\n') : 'No verified users yet.';
  await ctx.reply(msg);
});

export default bot; 