// telegram/bot.js
import 'dotenv/config';
import { Telegraf } from 'telegraf';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
// After user is found or created
const token = signToken({ telegramId: user.telegramId });
const dashboardUrl = `${WEB_URL}/dashboard?token=${token}`;

// Replace with your frontend login URL
const FRONTEND_URL = 'https://cobra-devtools.vercel.app/login';

/**
 * Signs a message (telegramId) using a random wallet key
 * This is fake-signing for session-based login (no private key exposed)
 */
const signMessage = (telegramId) => {
  const key = nacl.sign.keyPair();
  const message = new TextEncoder().encode(telegramId.toString());
  const signed = nacl.sign.detached(message, key.secretKey);

  return {
    publicKey: bs58.encode(key.publicKey),
    signature: bs58.encode(signed)
  };
};

bot.start(async (ctx) => {
  const telegramId = ctx.from.id;
  const username = ctx.from.username || '';

  const { publicKey, signature } = signMessage(telegramId);

  const loginUrl = `${FRONTEND_URL}?telegramId=${telegramId}&username=${username}&signature=${signature}&pubkey=${publicKey}`;

  await ctx.reply(`🔐 Cobra DevTools Login:\nClick below to access your dashboard 👇`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🚀 Open Dev Dashboard', url: loginUrl }]
      ]
    }
  });

  console.log(`🔑 Login link sent to @${username || 'user'} (${telegramId})`);
});

bot.launch();
console.log('🤖 Telegram bot started');

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
