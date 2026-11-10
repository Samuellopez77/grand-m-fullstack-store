import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  mergeCart,
} from '../controllers/cart.controller.js';

const router = express.Router();

// Every cart route belongs to the signed-in user, so auth runs first.
router.use(requireAuth);

router.get('/', getCart);
router.post('/items', addItem);
router.patch('/items/:variantId', updateItem);
router.delete('/items/:variantId', removeItem);
router.post('/merge', mergeCart);

export default router;