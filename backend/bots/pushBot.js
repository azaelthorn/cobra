// backend/bots/pushBot.js
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import bs58 from 'bs58';
import dotenv from 'dotenv';

dotenv.config();

const HELIUS_RPC = `https://rpc.helius.xyz/?api-key=${process.env.HELIUS_API_KEY}`;
const connection = new Connection(HELIUS_RPC, 'confirmed');

/**
 * Fire small SOL transfers to random wallets to create on-chain noise
 * @param {Object} cfg
 * @param {string} cfg.publicKey
 * @param {string} cfg.privateKey
 * @param {string} cfg.tokenMint - for logging purposes only
 */
export const startPushBot = async ({ publicKey, privateKey, tokenMint }) => {
  if (!publicKey || !privateKey || !tokenMint) {
    throw new Error('Missing required parameters');
  }

  const devKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
  console.log(`📢 Starting PushBot for ${tokenMint}`);

  setInterval(async () => {
    try {
      const recipient = Keypair.generate().publicKey;
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: devKeypair.publicKey,
          toPubkey: recipient,
          lamports: 5000, // tiny transfer
        })
      );
      tx.feePayer = devKeypair.publicKey;
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      const sig = await sendAndConfirmTransaction(connection, tx, [devKeypair]);
      console.log(`Push tx sent → https://solscan.io/tx/${sig}`);
    } catch (err) {
      console.error('PushBot error:', err.message);
    }
  }, 15000);
};
