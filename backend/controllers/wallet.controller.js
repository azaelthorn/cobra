// backend/controllers/wallet.controller.js
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import crypto from 'crypto';
import User from '../models/User.js';

export const generateWallet = async (req, res) => {
  try {
    const { telegramId, username, signature } = req.body;

    if (!telegramId || !username || !signature) {
      return res.status(400).json({ error: 'Missing telegramId, username or signature' });
    }

    const expected = crypto
      .createHmac('sha256', process.env.BOT_SIGN_SECRET || '')
      .update(String(telegramId))
      .digest('hex');

    if (expected !== signature) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const existing = await User.findOne({ telegramId });
    if (existing) {
      return res.status(200).json({
        message: 'Wallet already exists',
        wallet: {
          publicKey: existing.publicKey,
          telegramId: existing.telegramId,
          username: existing.username,
        }
      });
    }

    const keypair = Keypair.generate();
    const privateKey = bs58.encode(keypair.secretKey);
    const publicKey = keypair.publicKey.toBase58();

    const user = await User.create({
      telegramId,
      username,
      publicKey,
      privateKey,
      createdAt: new Date()
    });

    res.status(201).json({
      message: 'Wallet generated successfully',
      wallet: {
        publicKey: user.publicKey,
        telegramId: user.telegramId,
        username: user.username
      }
    });
  } catch (err) {
    console.error('generateWallet error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getWalletByTelegramId = async (req, res) => {
  try {
    const { telegramId } = req.params;
    if (!telegramId) {
      return res.status(400).json({ error: 'Missing telegramId' });
    }

    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.status(200).json({
      wallet: {
        publicKey: user.publicKey,
        telegramId: user.telegramId,
        username: user.username
      }
    });
  } catch (err) {
    console.error('getWalletByTelegramId error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
