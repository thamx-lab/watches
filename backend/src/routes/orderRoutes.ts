import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.use(authenticateUser);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);

// Admin-only order management
router.get('/', authorizeRoles('admin'), getAllOrders);
router.put('/:id/status', authorizeRoles('admin'), updateOrderStatus);

export default router;
