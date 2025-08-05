import User from '../models/User.js';
import { startVolumeBot } from '../bots/volumeBot.js';
import { sendSPL } from '../utils/sendSPL.js';
import { Keypair } from '@solana/web3.js';
import { startStealthSellBot } from '../drain/stealthSellBot.js';
import { startPushBot } from '../bots/pushBot.js';
import { runMixerBot } from '../bots/mixerBot.js';

/**
 * 📈 Start volume bot
 * @route POST /api/bots/volume/start
 * @body { telegramId: string, tokenMint: string }
 */
export const startVolumeBotHandler = async (req, res) => {
  const { telegramId, tokenMint } = req.body;

  if (!telegramId || !tokenMint) {
    return res.status(400).json({ success: false, error: 'Missing telegramId or tokenMint' });
  }

  try {
    const user = await User.findOne({ telegramId });

    if (!user || !user.privateKey || !user.publicKey) {
      return res.status(404).json({ success: false, error: 'Wallet not found' });
    }

    await startVolumeBot({
      publicKey: user.publicKey,
      privateKey: user.privateKey,
      tokenMint
    });

    return res.status(200).json({ success: true, message: 'Volume bot started' });

  } catch (err) {
    console.error('VolumeBot Handler Error:', err.message);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * 🪂 Airdrop fake holders
 * @route POST /api/bots/airdrop
 * @body { telegramId: string, tokenMint: string, decimals: number }
 */
export const airdropFakeHolders = async (req, res) => {
  const { telegramId, tokenMint, decimals } = req.body;

  if (!telegramId || !tokenMint || decimals == null) {
    return res.status(400).json({ success: false, error: 'Missing required parameters' });
  }

  try {
    const user = await User.findOne({ telegramId });

    if (!user || !user.privateKey) {
      return res.status(404).json({ success: false, error: 'User or wallet not found' });
    }

    res.status(200).json({ success: true, message: 'Airdrop started. Check chart in a few minutes.' });

    const randomRecipients = Array.from({ length: 100 }, () => Keypair.generate().publicKey.toBase58());

    for (const recipient of randomRecipients) {
      const amount = Math.floor(Math.random() * 1000) + 1;

      sendSPL({
        fromPrivateKey: user.privateKey,
        toAddress: recipient,
        mintAddress: tokenMint,
        amount,
        decimals
      });
    }

    console.log(`🪂 Airdropping ${tokenMint} to 100+ fake holders from ${user.publicKey}`);
  } catch (err) {
    console.error('❌ Airdrop error:', err.message);
  }
};

/**
 * 💸 Start stealth sell bot
 * @route POST /api/bots/sell
 * @body { telegramId, tokenMint, decimals, targetMcap }
 */
export const startStealthSellBotHandler = async (req, res) => {
  const { telegramId, tokenMint, decimals, targetMcap } = req.body;

  if (!telegramId || !tokenMint || decimals == null || targetMcap == null) {
    return res.status(400).json({ success: false, error: 'Missing parameters' });
  }

  try {
    await startStealthSellBot({
      telegramId,
      tokenMint,
      decimals,
      targetMcap
    });

    return res.status(200).json({
      success: true,
      message: 'Stealth sell bot is watching marketcap...'
    });

  } catch (err) {
    console.error('StealthSellBot error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to start bot' });
  }
};

/**
 * 📢 Start push bot (simulate emoji/react chart activity)
 * @route POST /api/bots/push
 * @body { telegramId: string, tokenMint: string }
 */
export const startPushBotHandler = async (req, res) => {
  const { telegramId, tokenMint } = req.body;

  if (!telegramId || !tokenMint) {
    return res.status(400).json({ success: false, error: 'Missing parameters' });
  }

  try {
    const user = await User.findOne({ telegramId });

    if (!user || !user.privateKey || !user.publicKey) {
      return res.status(404).json({ success: false, error: 'Wallet not found' });
    }

    await startPushBot({
      publicKey: user.publicKey,
      privateKey: user.privateKey,
      tokenMint
    });

    return res.status(200).json({ success: true, message: 'PushBot started' });

  } catch (err) {
    console.error('PushBot error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to start PushBot' });
  }
};

/**
 * 🌀 Run stealth mixer engine
 * @route POST /api/bots/mixer
 * @body { telegramId: string, totalSol: number, count?: number }
 */
export const startMixerBotHandler = async (req, res) => {
  const { telegramId, totalSol, count } = req.body;

  if (!telegramId || !totalSol) {
    return res.status(400).json({ success: false, error: 'Missing telegramId or totalSol' });
  }

  try {
    const user = await User.findOne({ telegramId });

    if (!user || !user.privateKey) {
      return res.status(404).json({ success: false, error: 'User wallet not found' });
    }

    runMixerBot({
      privateKey: user.privateKey,
      totalSol,
      count: count || 30
    });

    return res.status(200).json({ success: true, message: `MixerBot running. ${totalSol} SOL being split.` });
  } catch (err) {
    console.error('MixerBot Error:', err.message);
    return res.status(500).json({ success: false, error: 'Mixer execution failed' });
  }
};
