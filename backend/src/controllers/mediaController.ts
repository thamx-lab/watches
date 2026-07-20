import { Request, Response, NextFunction } from 'express';
import { db } from '../data/db.js';
import { ApiError, asyncHandler } from '../utils/apiError.js';

export const getMediaByTheme = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const theme = req.params.theme as string;
  const media = db.getMediaContentByTheme(theme);

  res.status(200).json({
    success: true,
    theme,
    media,
  });
});

export const getAllMedia = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const collections = db.getMediaContentCollection();

  res.status(200).json({
    success: true,
    mediaCollections: collections,
  });
});

export const updateThemeMedia = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const theme = req.params.theme as string;
  const content = req.body;

  if (!content || typeof content !== 'object') {
    return next(new ApiError(400, 'Valid media content object is required.'));
  }

  db.setMediaContent(theme, content);

  res.status(200).json({
    success: true,
    message: `Media content for theme '${theme}' updated.`,
    media: content,
  });
});
