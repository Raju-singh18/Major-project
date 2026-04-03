import express from 'express';
import {
  sendAnnouncement,
  getEventAnnouncements,
  deleteAnnouncement
} from '../controllers/announcementController.js';
import { protect, organizer } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, organizer, sendAnnouncement);
router.get('/event/:eventId', getEventAnnouncements);
router.delete('/:id', protect, organizer, deleteAnnouncement);

export default router;
