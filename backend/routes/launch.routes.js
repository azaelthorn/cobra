// backend/routes/launch.routes.js
import express from 'express';
import { launchTokenHandler } from '../controllers/launch.controller.js';

const router = express.Router();

/**
 * @route POST /api/launch
 * @desc Launch a token to selected launchpad
 */
router.post('/launch', launchTokenHandler);

export default router;
