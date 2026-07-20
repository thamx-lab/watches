import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

router.use(authenticateUser);

router.get('/', getCart);
router.post('/items', addToCart);
router.put('/items/:watchId', updateCartItemQuantity);
router.delete('/items/:watchId', removeFromCart);
router.delete('/', clearCart);

export default router;
