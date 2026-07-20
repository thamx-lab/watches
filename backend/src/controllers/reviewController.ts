import { Response, NextFunction } from 'express';
import { db } from '../data/db.js';
import { AuthRequest, IReview } from '../types/index.js';
import { ApiError, asyncHandler } from '../utils/apiError.js';

export const getReviewsByWatchId = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const watchId = req.params.watchId as string;
  const reviews = db.getReviewsByWatchId(watchId);

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
});

export const addReview = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return next(new ApiError(401, 'Not authenticated.'));

  const watchId = req.params.watchId as string;
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return next(new ApiError(400, 'Rating must be a number between 1 and 5.'));
  }

  if (!comment || comment.trim().length === 0) {
    return next(new ApiError(400, 'Review comment is required.'));
  }

  const watch = db.getWatchById(watchId);
  if (!watch) {
    return next(new ApiError(404, 'Watch not found.'));
  }

  const user = db.getUserById(req.user.id);

  const newReview: IReview = {
    id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    watchId,
    userId: req.user.id,
    userName: user?.name || 'Anonymous Collector',
    userAvatar: user?.avatar,
    rating: Number(rating),
    comment: comment.trim(),
    createdAt: new Date().toISOString(),
  };

  db.addReview(newReview);

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully.',
    review: newReview,
  });
});
