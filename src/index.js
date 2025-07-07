import bot from './bot.js';
import { startWebhookServer } from './webhook.js';

if (process.env.LOCAL_DEV === 'true') {
  (async () => {
    await bot.launch(); // long polling
    startWebhookServer(); // local Express for deposit webhook + Mini-App static
    console.log('🤖 Convoai bot dev server up');
  })();

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
} else {
  await bot.launch();
  startWebhookServer();
  console.log('🤖 Convoai bot is up and running');
}

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM')); 