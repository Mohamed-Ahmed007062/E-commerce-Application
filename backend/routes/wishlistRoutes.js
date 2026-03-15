import express from 'express';
const router = express.Router();
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(protect, getWishlist).post(protect, addToWishlist);
router.delete('/:productId', protect, removeFromWishlist);

export default router;
