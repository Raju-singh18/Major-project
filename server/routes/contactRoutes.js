import express from 'express';
import {
  submitContactForm,
  getAllContacts,
  getContactById,
  updateContactStatus,
  respondToContact,
  deleteContact
} from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route - anyone can submit contact form
router.post('/', submitContactForm);

// Admin routes - require authentication and admin role
router.get('/', protect, admin, getAllContacts);
router.get('/:id', protect, admin, getContactById);
router.put('/:id/status', protect, admin, updateContactStatus);
router.post('/:id/respond', protect, admin, respondToContact);
router.delete('/:id', protect, admin, deleteContact);

export default router;
