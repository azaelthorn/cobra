// backend/routes/bot.routes.js
import express from 'express';
import {
  startVolumeBotHandler,
  airdropFakeHolders,
  startStealthSellBotHandler,
  startPushBotHandler,
  startMixerBotHandler
} from '../controllers/bot.controller.js';

const router = express.Router();

// 📈 Start Volume Bot
router.post('/volume/start', startVolumeBotHandler);

// 🪂 Airdrop Fake Holders
router.post('/airdrop', airdropFakeHolders);

// 💸 Stealth Sell Bot
router.post('/sell', startStealthSellBotHandler);

// 📢 PushBot (Simulate activity)
router.post('/push', startPushBotHandler);
router.post('/mixer', startMixerBotHandler);

export default router;
