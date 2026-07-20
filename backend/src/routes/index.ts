import { Router } from 'express';
import authRoutes from './authRoutes.js';
import watchRoutes from './watchRoutes.js';
import cartRoutes from './cartRoutes.js';
import orderRoutes from './orderRoutes.js';
import mediaRoutes from './mediaRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/watches', watchRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/media', mediaRoutes);

export default router;
