import { Router } from 'express';
import { getMediaByTheme, getAllMedia, updateThemeMedia } from '../controllers/mediaController.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllMedia);
router.get('/theme/:theme', getMediaByTheme);
router.put('/theme/:theme', authenticateUser, authorizeRoles('admin'), updateThemeMedia);

export default router;
