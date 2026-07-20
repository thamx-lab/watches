import { Request, Response, NextFunction } from 'express';
import { db } from '../data/db.js';
import { IWatch } from '../types/index.js';
import { ApiError, asyncHandler } from '../utils/apiError.js';

export const getWatches = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let watches = db.getWatches();

  const { search, category, brand, theme, minPrice, maxPrice, featured, sort, page = '1', limit = '20' } = req.query;

  if (search) {
    const q = (search as string).toLowerCase();
    watches = watches.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.brand.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        w.referenceNumber.toLowerCase().includes(q)
    );
  }

  if (category) {
    watches = watches.filter((w) => w.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (brand) {
    watches = watches.filter((w) => w.brand.toLowerCase() === (brand as string).toLowerCase());
  }

  if (theme) {
    watches = watches.filter((w) => w.theme === (theme as string));
  }

  if (featured !== undefined) {
    const isFeatured = featured === 'true';
    watches = watches.filter((w) => w.featured === isFeatured);
  }

  if (minPrice) {
    const min = parseFloat(minPrice as string);
    if (!isNaN(min)) watches = watches.filter((w) => w.price >= min);
  }

  if (maxPrice) {
    const max = parseFloat(maxPrice as string);
    if (!isNaN(max)) watches = watches.filter((w) => w.price <= max);
  }

  if (sort) {
    switch (sort as string) {
      case 'price-asc':
        watches.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        watches.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        watches.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        watches.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        break;
    }
  }

  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 20;
  const total = watches.length;
  const totalPages = Math.ceil(total / limitNum);
  const startIndex = (pageNum - 1) * limitNum;
  const paginatedWatches = watches.slice(startIndex, startIndex + limitNum);

  res.status(200).json({
    success: true,
    count: paginatedWatches.length,
    total,
    page: pageNum,
    totalPages,
    watches: paginatedWatches,
  });
});

export const getFeaturedWatches = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const watches = db.getWatches().filter((w) => w.featured);

  res.status(200).json({
    success: true,
    count: watches.length,
    watches,
  });
});

export const getWatchById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;
  const watch = db.getWatchById(id);

  if (!watch) {
    return next(new ApiError(404, `Watch with ID ${id} not found.`));
  }

  res.status(200).json({
    success: true,
    watch,
  });
});

export const createWatch = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const watchData: Partial<IWatch> = req.body;

  if (!watchData.name || !watchData.brand || watchData.price === undefined) {
    return next(new ApiError(400, 'Name, brand, and price are required.'));
  }

  const newWatch: IWatch = {
    id: `watch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: watchData.name,
    brand: watchData.brand,
    referenceNumber: watchData.referenceNumber || 'REF-GENERIC',
    price: Number(watchData.price),
    currency: watchData.currency || 'USD',
    description: watchData.description || '',
    overview: watchData.overview || '',
    conclusion: watchData.conclusion || '',
    caseMaterial: watchData.caseMaterial || 'Stainless Steel',
    strapMaterial: watchData.strapMaterial || 'Leather',
    waterResistance: watchData.waterResistance || '50m',
    movement: watchData.movement || 'Automatic',
    dialColor: watchData.dialColor || 'Black',
    caseSize: watchData.caseSize || '40mm',
    category: watchData.category || 'Luxury',
    theme: watchData.theme || 'classic',
    stock: watchData.stock !== undefined ? Number(watchData.stock) : 10,
    images: watchData.images && watchData.images.length > 0 ? watchData.images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
    featured: watchData.featured || false,
    rating: 0,
    reviewCount: 0,
    establishedDate: watchData.establishedDate || new Date().getFullYear().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.addWatch(newWatch);

  res.status(201).json({
    success: true,
    message: 'Watch created successfully.',
    watch: newWatch,
  });
});

export const updateWatch = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;
  const updates = req.body;

  const existingWatch = db.getWatchById(id);
  if (!existingWatch) {
    return next(new ApiError(404, `Watch with ID ${id} not found.`));
  }

  const updatedWatch = db.updateWatch(id, updates);

  res.status(200).json({
    success: true,
    message: 'Watch updated successfully.',
    watch: updatedWatch,
  });
});

export const deleteWatch = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;
  const success = db.deleteWatch(id);

  if (!success) {
    return next(new ApiError(404, `Watch with ID ${id} not found.`));
  }

  res.status(200).json({
    success: true,
    message: 'Watch deleted successfully.',
  });
});
