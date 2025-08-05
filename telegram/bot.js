// telegram/bot.js
import 'dotenv/config';
import { Telegraf } from 'telegraf';
import crypto from 'crypto';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const FRONTEND_URL = process.env.CLIENT_URL || 'https://cobra-devtools.vercel.app/login';
const BOT_SIGN_SECRET = process.env.BOT_SIGN_SECRET || '';

const signMessage = (telegramId) => {
  return crypto
    .createHmac('sha256', BOT_SIGN_SECRET)
    .update(String(telegramId))
    .digest('hex');
};

bot.start(async (ctx) => {
  const telegramId = ctx.from.id;
  const username = ctx.from.username || '';

  const signature = signMessage(telegramId);
  const loginUrl = `${FRONTEND_URL}?telegramId=${telegramId}&username=${username}&signature=${signature}`;

  await ctx.reply('Cobra DevTools Login:\nClick below to access your dashboard', {
    reply_markup: {
      inline_keyboard: [[{ text: 'Open Dev Dashboard', url: loginUrl }]]
    }
  });

  console.log(`Login link sent to @${username || 'user'} (${telegramId})`);
});

bot.launch();
console.log('Telegram bot started');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
