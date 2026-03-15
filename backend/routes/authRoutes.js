import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
  forgotPassword,
  resetPassword,
  changePassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.route('/profile').get(protect, getUserProfile);
router.put('/change-password', protect, changePassword);

export default router;
