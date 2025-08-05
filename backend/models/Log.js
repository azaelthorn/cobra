// backend/models/Log.js
import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  telegramId: String,
  action: String, // e.g., 'volumeBot:start'
  tokenMint: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Log', logSchema);
