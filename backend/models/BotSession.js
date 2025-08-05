// backend/models/BotSession.js
import mongoose from 'mongoose';

const BotSessionSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    index: true,
  },
  tokenMint: {
    type: String,
    required: true,
    index: true,
  },
  bots: {
    volume: { type: Boolean, default: false },
    airdrop: { type: Boolean, default: false },
    push: { type: Boolean, default: false },
    mixer: { type: Boolean, default: false },
    sell: { type: Boolean, default: false },
  },
  targetMcap: { type: Number, default: null },
  lastUpdated: { type: Date, default: Date.now },
});

BotSessionSchema.index({ telegramId: 1, tokenMint: 1 }, { unique: true });

const BotSession = mongoose.model('BotSession', BotSessionSchema);
export default BotSession;
