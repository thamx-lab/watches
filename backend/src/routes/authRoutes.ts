import { Router } from 'express';
import { register, login, getMe, updateProfile } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateUser, getMe);
router.put('/profile', authenticateUser, updateProfile);

export default router;
