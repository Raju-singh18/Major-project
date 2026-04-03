import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  getEventStats,
  getTrendingEvents
} from '../controllers/eventController.js';
import { protect, organizer } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/stats', getEventStats);
router.get('/trending', getTrendingEvents);
router.get('/featured', getEvents);

// Main routes
router.route('/')
  .get(getEvents)
  .post(protect, organizer, createEvent);

// Protected routes
router.get('/my-events', protect, organizer, getMyEvents);

// Event-specific routes
router.route('/:id')
  .get(getEventById)
  .put(protect, organizer, updateEvent)
  .delete(protect, organizer, deleteEvent);

export default router;
