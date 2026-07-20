import { Request, Response, NextFunction } from 'express';
import { Watch } from '../models/index.js';
import { IWatch } from '../types/index.js';
import { ApiError, asyncHandler } from '../utils/apiError.js';

export const getWatches = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { search, category, brand, theme, minPrice, maxPrice, featured, sort, page = '1', limit = '20' } = req.query;

  const query: any = {};

  if (search) {
    const q = new RegExp(search as string, 'i');
    query.$or = [
      { name: q },
      { brand: q },
      { description: q },
      { referenceNumber: q }
    ];
  }

  if (category) {
    query.category = new RegExp(category as string, 'i');
  }

  if (brand) {
    query.brand = new RegExp(brand as string, 'i');
  }

  if (theme) {
    query.theme = theme as string;
  }

  if (featured !== undefined) {
    query.featured = featured === 'true';
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice as string);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice as string);
  }

  let sortQuery: any = {};
  if (sort) {
    switch (sort as string) {
      case 'price-asc': sortQuery = { price: 1 }; break;
      case 'price-desc': sortQuery = { price: -1 }; break;
      case 'rating-desc': sortQuery = { rating: -1 }; break;
      case 'newest': sortQuery = { createdAt: -1 }; break;
      default: break;
    }
  }

  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 20;
  const startIndex = (pageNum - 1) * limitNum;

  const total = await Watch.countDocuments(query);
  const totalPages = Math.ceil(total / limitNum);

  const watches = await Watch.find(query).sort(sortQuery).skip(startIndex).limit(limitNum);

  res.status(200).json({
    success: true,
    count: watches.length,
    total,
    page: pageNum,
    totalPages,
    watches,
  });
});

export const getFeaturedWatches = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const watches = await Watch.find({ featured: true });

  res.status(200).json({
    success: true,
    count: watches.length,
    watches,
  });
});

export const getWatchById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;
  const watch = await Watch.findOne({ id });

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

  const newWatch = {
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

  await Watch.create(newWatch);

  res.status(201).json({
    success: true,
    message: 'Watch created successfully.',
    watch: newWatch,
  });
});

export const updateWatch = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;
  const updates = req.body;
  updates.updatedAt = new Date().toISOString();

  const updatedWatch = await Watch.findOneAndUpdate({ id }, updates, { new: true });

  if (!updatedWatch) {
    return next(new ApiError(404, `Watch with ID ${id} not found.`));
  }

  res.status(200).json({
    success: true,
    message: 'Watch updated successfully.',
    watch: updatedWatch,
  });
});

export const deleteWatch = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;
  const deletedWatch = await Watch.findOneAndDelete({ id });

  if (!deletedWatch) {
    return next(new ApiError(404, `Watch with ID ${id} not found.`));
  }

  res.status(200).json({
    success: true,
    message: 'Watch deleted successfully.',
  });
});
