import { Router } from 'express';
import { handleInquiry } from '../controllers/inquiryController.js';

const router = Router();

// Endpoint: POST /api/v1/inquiries or /api/inquiries
router.post('/', handleInquiry);

export default router;
