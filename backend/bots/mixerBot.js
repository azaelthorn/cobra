// backend/bots/mixerBot.js
import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import bs58 from 'bs58';
import dotenv from 'dotenv';

dotenv.config();

const HELIUS_RPC = `https://rpc.helius.xyz/?api-key=${process.env.HELIUS_API_KEY}`;
const connection = new Connection(HELIUS_RPC, 'confirmed');

/**
 * Split SOL across random wallets to obfuscate trails
 * @param {Object} cfg
 * @param {string} cfg.privateKey
 * @param {number} cfg.totalSol
 * @param {number} cfg.count
 */
export const runMixerBot = async ({ privateKey, totalSol, count }) => {
  if (!privateKey || !totalSol || !count) {
    throw new Error('Missing mixer parameters');
  }

  const fromKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
  const lamportsPerTx = Math.floor((totalSol * LAMPORTS_PER_SOL) / count);
  console.log(`🌀 Mixing ${totalSol} SOL into ${count} wallets`);

  for (let i = 0; i < count; i++) {
    const recipient = Keypair.generate().publicKey;
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: recipient,
        lamports: lamportsPerTx,
      })
    );
    tx.feePayer = fromKeypair.publicKey;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    try {
      const sig = await sendAndConfirmTransaction(connection, tx, [fromKeypair]);
      console.log(`Mix ${i + 1}/${count} → ${recipient.toBase58()} | https://solscan.io/tx/${sig}`);
    } catch (err) {
      console.error('Mixer tx failed:', err.message);
    }
  }
};
