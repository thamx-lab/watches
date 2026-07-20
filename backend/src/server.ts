import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import apiRoutes from './routes/index.js';
import { ApiError } from './utils/apiError.js';
import { logger } from './utils/logger.js';

import { connectDB } from './data/db.js';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Utility Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(
  morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// Health check endpoints
app.get(['/health', '/api/health'], (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    service: 'Luxury Watches Backend API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/v1', apiRoutes);
app.use('/api', apiRoutes);

// 404 Route Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, `Cannot ${req.method} ${req.originalUrl} - Route not found.`));
});

// Global Error Handler Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`[${req.method} ${req.url}] ${statusCode} - ${message}`, err.stack);

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// Start Server
app.listen(PORT, () => {
  logger.info(`🚀 Luxury Watches Backend API running on port ${PORT}`);
  logger.info(`👉 Health check: http://localhost:${PORT}/health`);
  logger.info(`👉 API v1 Base: http://localhost:${PORT}/api/v1`);
});

export default app;
