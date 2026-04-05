import express from 'express';
import { chat } from '../controllers/chatController.js';

const router = express.Router();

// Public — no auth required so guests can also use chat
router.post('/', chat);

export default router;
