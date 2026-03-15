import express from 'express';
const router = express.Router();
import {
  getUserCart,
  addItemToCart,
  removeItemFromCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(protect, getUserCart).post(protect, addItemToCart);
router.route('/:productId').delete(protect, removeItemFromCart);

export default router;
