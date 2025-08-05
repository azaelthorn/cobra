// backend/utils/fetchMarketcap.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BIRDEYE_API = 'https://public-api.birdeye.so/public/token/';
const API_KEY = process.env.BIRDEYE_API_KEY;

/**
 * Get current marketcap (FDV) of a token
 * @param {string} tokenMint - Solana token address
 * @returns {Promise<number>} - Marketcap in USD
 */
export const fetchMarketcap = async (tokenMint) => {
  try {
    const res = await axios.get(`${BIRDEYE_API}${tokenMint}`, {
      headers: {
        'x-chain': 'solana',
        'X-API-KEY': API_KEY
      }
    });

    const mcap = res?.data?.data?.fdv || 0;
    return mcap;
  } catch (err) {
    console.error('❌ Failed to fetch marketcap:', err.message);
    return 0;
  }
};
