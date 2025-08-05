// backend/controllers/launch.controller.js
import User from '../models/User.js';
import axios from 'axios';
import { PublicKey } from '@solana/web3.js';

/**
 * @route POST /api/launch
 * @body {
 *   telegramId: string,
 *   name: string,
 *   symbol: string,
 *   supply: number,
 *   decimals: number,
 *   launchpad: string
 * }
 */
export const launchTokenHandler = async (req, res) => {
  const { telegramId, name, symbol, supply, decimals, launchpad } = req.body;

  if (!telegramId || !name || !symbol || !supply || decimals == null || !launchpad) {
    return res.status(400).json({ success: false, error: 'Missing parameters' });
  }

  try {
    const user = await User.findOne({ telegramId });

    if (!user || !user.publicKey || !user.privateKey) {
      return res.status(404).json({ success: false, error: 'Wallet not found' });
    }

    const pubkey = new PublicKey(user.publicKey).toBase58();
    let launchUrl;

    switch (launchpad) {
      case 'pumpfun':
        launchUrl = await handlePumpFunLaunch({ name, symbol, supply, decimals, devPubkey: pubkey });
        break;

      case 'letsbonk':
        launchUrl = await handleLetsBonkLaunch({ name, symbol, supply, decimals, devPubkey: pubkey });
        break;

      case 'meteora':
        launchUrl = await handleMeteoraLaunch({ name, symbol, supply, decimals, devPubkey: pubkey });
        break;

      case 'launchlab':
        launchUrl = await handleLaunchLabLaunch({ name, symbol, supply, decimals, devPubkey: pubkey });
        break;

      default:
        return res.status(400).json({ success: false, error: 'Invalid launchpad selected' });
    }

    return res.status(200).json({
      success: true,
      message: 'Token launched successfully',
      launchUrl
    });
  } catch (err) {
    console.error('Launch Controller Error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to launch token' });
  }
};

// === Pump.fun Reverse Launch ===
const handlePumpFunLaunch = async ({ name, symbol, supply, decimals, devPubkey }) => {
  // Normally this is a frontend mint -> followed by POST to pumpfun backend
  // We'll simulate it with a mock API call (or your proxy pumpfun API)
  try {
    const res = await axios.post('https://api.cobra-devtools.io/pumpfun/launch', {
      name,
      symbol,
      supply,
      decimals,
      devPubkey
    });

    if (res.data && res.data.url) {
      return res.data.url;
    } else {
      throw new Error('Pump.fun API failed');
    }
  } catch (err) {
    throw new Error('Pump.fun Launch Error: ' + err.message);
  }
};

// === LetsBonk.fun Launch ===
const handleLetsBonkLaunch = async ({ name, symbol, supply, decimals, devPubkey }) => {
  try {
    const res = await axios.post('https://api.cobra-devtools.io/bonk/launch', {
      name,
      symbol,
      supply,
      decimals,
      devPubkey
    });

    if (res.data && res.data.url) {
      return res.data.url;
    } else {
      throw new Error('LetsBonk API failed');
    }
  } catch (err) {
    throw new Error('LetsBonk Launch Error: ' + err.message);
  }
};

// === Meteora Launchpad ===
const handleMeteoraLaunch = async ({ name, symbol, supply, decimals, devPubkey }) => {
  try {
    const res = await axios.post('https://api.cobra-devtools.io/meteora/launch', {
      name,
      symbol,
      supply,
      decimals,
      devPubkey
    });

    if (res.data && res.data.url) {
      return res.data.url;
    } else {
      throw new Error('Meteora API failed');
    }
  } catch (err) {
    throw new Error('Meteora Launch Error: ' + err.message);
  }
};

// === LaunchLab Launchpad ===
const handleLaunchLabLaunch = async ({ name, symbol, supply, decimals, devPubkey }) => {
  try {
    const res = await axios.post('https://api.cobra-devtools.io/launchlab/launch', {
      name,
      symbol,
      supply,
      decimals,
      devPubkey
    });

    if (res.data && res.data.url) {
      return res.data.url;
    } else {
      throw new Error('LaunchLab API failed');
    }
  } catch (err) {
    throw new Error('LaunchLab Launch Error: ' + err.message);
  }
};
