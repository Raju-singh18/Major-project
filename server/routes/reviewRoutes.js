import express from 'express';
import {
  createReview,
  getEventReviews,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/event/:eventId', getEventReviews);
router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

export default router;
