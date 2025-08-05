// backend/utils/sendSPL.js
import {
  Connection,
  PublicKey,
  Keypair,
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
 * Send SPL token with auto ATA create if needed
 * @param {string} fromPrivateKey - base58 encoded
 * @param {string} toAddress - publicKey base58
 * @param {string} mintAddress - token mint
 * @param {number} amount - amount in raw units (respect decimals)
 * @param {number} decimals - usually 6 or 9
 */
export const sendSPL = async ({ fromPrivateKey, toAddress, mintAddress, amount, decimals }) => {
  const sender = Keypair.fromSecretKey(bs58.decode(fromPrivateKey));
  const fromPublicKey = sender.publicKey;
  const recipient = new PublicKey(toAddress);
  const mint = new PublicKey(mintAddress);

  try {
    const fromATA = await getAssociatedTokenAddress(mint, fromPublicKey);
    const toATA = await getAssociatedTokenAddress(mint, recipient);

    const instructions = [];

    // Create ATA for recipient if not exist
    const toInfo = await connection.getAccountInfo(toATA);
    if (!toInfo) {
      instructions.push(
        createAssociatedTokenAccountInstruction(fromPublicKey, toATA, recipient, mint)
      );
    }

    // Transfer instruction
    instructions.push(
      createTransferCheckedInstruction(
        fromATA,        // source ATA
        mint,           // mint
        toATA,          // destination ATA
        fromPublicKey,  // authority
        amount,         // raw amount (not formatted)
        decimals
      )
    );

    const tx = new Transaction().add(...instructions);
    tx.feePayer = fromPublicKey;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const sig = await sendAndConfirmTransaction(connection, tx, [sender]);
    console.log(`✅ SPL sent: ${amount} → ${toAddress} | TX: ${sig}`);
    return sig;
  } catch (err) {
    console.error('❌ sendSPL Error:', err.message);
    return null;
  }
};
