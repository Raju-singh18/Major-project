import express from 'express';
import {
  getEventDashboard,
  getOrganizerStats
} from '../controllers/organizerController.js';
import { protect, organizer } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, organizer);

router.get('/stats', getOrganizerStats);
router.get('/event-dashboard/:eventId', getEventDashboard);

export default router;
