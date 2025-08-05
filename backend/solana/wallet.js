// backend/solana/wallet.js
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

/**
 * Generate a new Solana wallet
 * @returns {Object} { publicKey, privateKey (base58 encoded), keypair }
 */
export const generateSolanaWallet = () => {
  const keypair = Keypair.generate();

  const privateKey = bs58.encode(keypair.secretKey);
  const publicKey = keypair.publicKey.toBase58();

  return {
    publicKey,
    privateKey,
    keypair
  };
};
