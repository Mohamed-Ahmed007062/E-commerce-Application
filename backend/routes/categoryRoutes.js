import express from 'express';
const router = express.Router();
import {
  getCategories,
  createCategory,
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getCategories).post(protect, admin, createCategory);

export default router;
