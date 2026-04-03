import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  createOrder,
  verifyPayment
} from '../controllers/bookingController.js';
import { createMockBooking } from '../controllers/mockPaymentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createBooking)
  .get(protect, admin, getAllBookings);

router.post('/create-order', protect, createOrder);
router.post('/verify-payment', protect, verifyPayment);

// Mock payment for development (when Razorpay is not configured)
router.post('/mock-payment', protect, createMockBooking);

router.get('/my-bookings', protect, getMyBookings);

router.route('/:id')
  .get(protect, getBookingById)
  .delete(protect, cancelBooking);

export default router;
