// backend/routes/wallet.routes.js
import express from 'express';
import {
  generateWallet,
  getWalletByTelegramId
} from '../controllers/wallet.controller.js';

const router = express.Router();

// POST /api/wallet/generate
router.post('/generate', generateWallet);

// GET /api/wallet/:telegramId
router.get('/:telegramId', getWalletByTelegramId);

export default router;
