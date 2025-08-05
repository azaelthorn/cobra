// backend/bots/volumeBot.js
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';

import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
} from '@solana/spl-token';

import bs58 from 'bs58';
import dotenv from 'dotenv';
dotenv.config();

const HELIUS_RPC = `https://rpc.helius.xyz/?api-key=${process.env.HELIUS_API_KEY}`;
const connection = new Connection(HELIUS_RPC, 'confirmed');

/**
 * Start volume bot for a specific dev user
 * @param {Object} config
 * @param {string} config.publicKey - dev wallet
 * @param {string} config.privateKey - dev wallet (base58)
 * @param {string} config.tokenMint - target token mint
 */
export const startVolumeBot = async ({ publicKey, privateKey, tokenMint }) => {
  if (!publicKey || !privateKey || !tokenMint) {
    throw new Error('Missing required parameters');
  }

  const devKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
  const mintPubkey = new PublicKey(tokenMint);
  const devPubkey = new PublicKey(publicKey);

  console.log(`📈 Starting Volume Bot for ${publicKey} | Token: ${tokenMint}`);

  let cycle = 0;

  setInterval(async () => {
    cycle++;
    const action = Math.random() > 0.5 ? 'buy' : 'sell';
    const randomWallet = Keypair.generate().publicKey;
    const recipient = randomWallet;
    const amount = Math.floor(Math.random() * 100) + 10; // Simulate 10–110 tokens

    try {
      const fromATA = await getAssociatedTokenAddress(mintPubkey, devPubkey);
      const toATA = await getAssociatedTokenAddress(mintPubkey, recipient, true);

      const instructions = [];

      // Buat ATA jika belum ada
      const toInfo = await connection.getAccountInfo(toATA);
      if (!toInfo) {
        instructions.push(
          createAssociatedTokenAccountInstruction(
            devPubkey,
            toATA,
            recipient,
            mintPubkey
          )
        );
      }

      instructions.push(
        createTransferCheckedInstruction(
          fromATA,
          mintPubkey,
          toATA,
          devPubkey,
          amount,
          6 // decimals
        )
      );

      const tx = new Transaction().add(...instructions);
      tx.feePayer = devPubkey;
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      const sig = await sendAndConfirmTransaction(connection, tx, [devKeypair]);

      console.log(
        `[${cycle}] ${action.toUpperCase()} ✅ Sent ${amount} token → ${recipient.toBase58()} | TX: ${sig}`
      );
    } catch (err) {
      console.error(`[${cycle}] ❌ VolumeBot Error:`, err.message);
    }
  }, 10000); // every 10 seconds
};
