// backend/routes/bots/status.routes.js
import express from 'express';
import BotSession from '../../models/BotSession.js';

const router = express.Router();

/**
 * @route GET /api/bots/status?telegramId=...
 * @desc Get all bot sessions for a developer
 */
router.get('/status', async (req, res) => {
  const { telegramId } = req.query;

  if (!telegramId) {
    return res.status(400).json({ success: false, error: 'Missing telegramId' });
  }

  try {
    const sessions = await BotSession.find({ telegramId }).sort({ lastUpdated: -1 });

    return res.status(200).json({
      success: true,
      sessions
    });
  } catch (err) {
    console.error('Bot Status Error:', err.message);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
