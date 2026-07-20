import { Router } from 'express';
import {
  getWatches,
  getFeaturedWatches,
  getWatchById,
  createWatch,
  updateWatch,
  deleteWatch,
} from '../controllers/watchController.js';
import { getReviewsByWatchId, addReview } from '../controllers/reviewController.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.get('/', getWatches);
router.get('/featured', getFeaturedWatches);
router.get('/:id', getWatchById);

// Reviews linked to watch
router.get('/:watchId/reviews', getReviewsByWatchId);
router.post('/:watchId/reviews', authenticateUser, addReview);

// Admin-only watch management
router.post('/', authenticateUser, authorizeRoles('admin'), createWatch);
router.put('/:id', authenticateUser, authorizeRoles('admin'), updateWatch);
router.delete('/:id', authenticateUser, authorizeRoles('admin'), deleteWatch);

export default router;
