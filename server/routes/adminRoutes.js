import express from 'express';
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getDashboardStats,
  getAllEvents,
  approveEvent,
  rejectEvent,
  deleteEvent,
  getOrganizers,
  suspendUser,
  unsuspendUser,
  deleteReview,
  getAllReviews,
  getContactInfo
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route — no auth needed
router.get('/contact-info', getContactInfo);

// All routes below require admin auth
router.use(protect, admin);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/organizers', getOrganizers);
router.get('/events', getAllEvents);
router.get('/reviews', getAllReviews);

router.route('/users/:id')
  .put(updateUserRole)
  .delete(deleteUser);

router.put('/users/:id/suspend', suspendUser);
router.put('/users/:id/unsuspend', unsuspendUser);

router.put('/events/:id/approve', approveEvent);
router.put('/events/:id/reject', rejectEvent);
router.delete('/events/:id', deleteEvent);

router.delete('/reviews/:id', deleteReview);

export default router;
