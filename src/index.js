import bot from './bot.js';
import { startWebhookServer } from './webhook.js';

(async () => {
  await bot.launch();
  startWebhookServer();
  console.log('🤖 Convoai bot is up and running');
})();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM')); 