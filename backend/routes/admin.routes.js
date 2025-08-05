// backend/routes/admin.routes.js
import express from 'express';
import Log from '../models/Log.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all logs (admin only)
router.get('/logs', authenticate, async (req, res) => {
  if (req.user.telegramId !== process.env.ADMIN_TELEGRAM_ID)
    return res.status(403).json({ error: 'Not authorized' });

  const logs = await Log.find().sort({ timestamp: -1 }).limit(200);
  res.json({ success: true, logs });
});

export default router;
