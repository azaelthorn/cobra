// backend/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  username: { type: String },
  publicKey: { type: String, required: true },
  privateKey: { type: String, required: true }, // base58 encoded
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
