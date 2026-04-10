import express from 'express';
import { getLegalPage, upsertLegalPage } from '../controllers/legalController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/:type', getLegalPage);

// Admin only
router.put('/:type', protect, admin, upsertLegalPage);

export default router;
