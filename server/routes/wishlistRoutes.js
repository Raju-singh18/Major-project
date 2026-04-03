import express from 'express';
import {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  getWishlist,
  checkWishlist,
  clearWishlist
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', getWishlist);
router.post('/toggle', toggleWishlist);
router.post('/add', addToWishlist);
router.delete('/clear', clearWishlist);
router.delete('/:eventId', removeFromWishlist);
router.get('/check/:eventId', checkWishlist);

export default router;
