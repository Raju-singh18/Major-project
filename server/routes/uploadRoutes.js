import express from 'express';
import { uploadImage, uploadAvatar, deleteImage } from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/image', protect, uploadImage);
router.post('/avatar', protect, uploadAvatar);
router.delete('/image/:publicId', protect, deleteImage);

export default router;
