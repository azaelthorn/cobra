// backend/controllers/airdrop.controller.js
import User from '../models/User.js';
import { sendSPL } from '../utils/sendSPL.js';
import { Keypair } from '@solana/web3.js';

/**
 * Airdrop fake token to 100+ random wallets to simulate holders
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

    // Respond early (fire and forget)
    res.status(200).json({ success: true, message: 'Airdrop started. Check holders in a few minutes.' });

    // Create 100 random wallets
    const randomRecipients = Array.from({ length: 100 }, () => Keypair.generate().publicKey.toBase58());

    for (const recipient of randomRecipients) {
      const amount = Math.floor(Math.random() * 1000) + 1;

      // Send in background (non-blocking)
      sendSPL({
        fromPrivateKey: user.privateKey,
        toAddress: recipient,
        mintAddress: tokenMint,
        amount,
        decimals
      });
    }

    console.log(`🪂 Airdropping token ${tokenMint} to 100+ wallets from ${user.publicKey}`);

  } catch (err) {
    console.error('❌ Airdrop error:', err.message);
    // No need to return res again since already sent
  }
};
