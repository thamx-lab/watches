import { Response, NextFunction } from 'express';
import { Review, Watch, User } from '../models/index.js';
import { AuthRequest } from '../types/index.js';
import { ApiError, asyncHandler } from '../utils/apiError.js';

export const getReviewsByWatchId = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const watchId = req.params.watchId as string;
  const reviews = await Review.find({ watchId });

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

  const watch = await Watch.findOne({ id: watchId });
  if (!watch) {
    return next(new ApiError(404, 'Watch not found.'));
  }

  const user = await User.findOne({ id: req.user.id });

  const newReview = {
    id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    watchId,
    userId: req.user.id,
    userName: user?.name || 'Anonymous Collector',
    userAvatar: user?.avatar,
    rating: Number(rating),
    comment: comment.trim(),
    createdAt: new Date().toISOString(),
  };

  await Review.create(newReview);

  // Update watch aggregate rating
  const watchReviews = await Review.find({ watchId });
  const totalRating = watchReviews.reduce((sum: number, r: any) => sum + r.rating, 0);
  const avgRating = Number((totalRating / watchReviews.length).toFixed(1));
  await Watch.findOneAndUpdate(
    { id: watchId },
    { rating: avgRating, reviewCount: watchReviews.length, updatedAt: new Date().toISOString() }
  );

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully.',
    review: newReview,
  });
});
