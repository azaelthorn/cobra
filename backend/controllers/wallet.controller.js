// backend/controllers/wallet.controller.js
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import User from '../models/User.js';

export const generateWallet = async (req, res) => {
  try {
    const { telegramId, username } = req.body;

    if (!telegramId || !username) {
      return res.status(400).json({ error: 'Missing telegramId or username' });
    }

    // Cek apakah user sudah punya wallet
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

    // Generate wallet Solana
    const keypair = Keypair.generate();
    const privateKey = bs58.encode(keypair.secretKey);
    const publicKey = keypair.publicKey.toBase58();

    // Simpan ke DB
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
// backend/controllers/launch.controller.js
import axios from 'axios';

export const launchToken = async (req, res) => {
  const { tokenName, supply, publicKey, launchpad, telegramId } = req.body;

  if (!tokenName || !supply || !publicKey || !launchpad || !telegramId) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  try {
    let response;
    let tx = '';

    switch (launchpad) {
      case 'pumpfun':
        response = await launchToPumpFun(tokenName, supply, publicKey);
        tx = response?.data?.tx || 'N/A';
        break;

      case 'bonk':
        response = await launchToBonk(tokenName, supply, publicKey);
        tx = response?.data?.tx || 'N/A';
        break;

      case 'meteora':
        // Simulate for now
        tx = `simulate-${Date.now()}`;
        break;

      case 'launchlab':
        // Simulate for now
        tx = `launchlab-${Date.now()}`;
        break;

      default:
        return res.status(400).json({ success: false, error: 'Invalid launchpad' });
    }

    console.log(`✅ Token launched on ${launchpad} by ${publicKey} | TX: ${tx}`);
    res.status(200).json({ success: true, tx });

  } catch (err) {
    console.error(`❌ Launch error on ${launchpad}:`, err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 👉 Pump.fun Launch API
const launchToPumpFun = async (tokenName, supply, publicKey) => {
  return axios.post('https://pump.fun/api/create', {
    name: tokenName,
    symbol: tokenName.slice(0, 4).toUpperCase(),
    supply: parseInt(supply),
    creator: publicKey
  });
};

// 👉 LetsBonk.fun Launch API
const launchToBonk = async (tokenName, supply, publicKey) => {
  return axios.post('https://api.letsbonk.io/launch', {
    token_name: tokenName,
    token_symbol: tokenName.slice(0, 4).toUpperCase(),
    total_supply: parseInt(supply),
    creator_address: publicKey
  });
};
