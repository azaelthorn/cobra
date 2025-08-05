// backend/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Route imports
import walletRoutes from './routes/wallet.routes.js';
import launchRoutes from './routes/launch.routes.js';
import botRoutes from './routes/bot.routes.js';
import botStatusRoutes from './routes/bots/status.routes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/wallet', walletRoutes);        // Dev wallet logic
app.use('/api/launch', launchRoutes);        // Token creation + launchpad
app.use('/api/bots', botRoutes);             // Volume, push, airdrop, mixer, sell
app.use('/api/bots', botStatusRoutes);       // Bot monitoring

// Health Check
app.get('/', (req, res) => {
  res.status(200).json({ message: '🐍 Cobra DevTools Backend is running.' });
});

// MongoDB Connection
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');

    app.listen(PORT, () => {
      console.log(`🚀 Backend API running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

startServer();
