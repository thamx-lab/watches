import { Response, NextFunction } from 'express';
import { Cart, Watch } from '../models/index.js';
import { AuthRequest } from '../types/index.js';
import { ApiError, asyncHandler } from '../utils/apiError.js';

export const getCart = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return next(new ApiError(401, 'Not authenticated.'));

  let cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) {
    cart = await Cart.create({
      userId: req.user.id,
      items: [],
      totalAmount: 0,
      updatedAt: new Date().toISOString(),
    });
  }

  res.status(200).json({
    success: true,
    cart,
  });
});

export const addToCart = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return next(new ApiError(401, 'Not authenticated.'));

  const { watchId, quantity = 1 } = req.body;

  if (!watchId) {
    return next(new ApiError(400, 'Watch ID is required.'));
  }

  const watch = await Watch.findOne({ id: watchId });
  if (!watch) {
    return next(new ApiError(404, 'Watch not found.'));
  }

  let cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) {
    cart = await Cart.create({
      userId: req.user.id,
      items: [],
      totalAmount: 0,
      updatedAt: new Date().toISOString(),
    });
  }

  const existingItemIndex = cart.items.findIndex((item) => item.watchId === watchId);

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += Number(quantity);
  } else {
    cart.items.push({
      watchId: watch.id,
      quantity: Number(quantity),
      price: watch.price,
      watchName: watch.name,
      watchImage: watch.images[0] || '',
    });
  }

  cart.totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cart.updatedAt = new Date().toISOString();

  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Item added to cart.',
    cart,
  });
});

export const updateCartItemQuantity = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return next(new ApiError(401, 'Not authenticated.'));

  const watchId = req.params.watchId as string;
  const { quantity } = req.body;

  if (quantity === undefined || isNaN(Number(quantity))) {
    return next(new ApiError(400, 'Valid quantity is required.'));
  }

  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) return next(new ApiError(404, 'Cart not found.'));

  const qty = Number(quantity);

  if (qty <= 0) {
    cart.items = cart.items.filter((item) => item.watchId !== watchId);
  } else {
    const itemIndex = cart.items.findIndex((item) => item.watchId === watchId);
    if (itemIndex === -1) {
      return next(new ApiError(404, 'Item not found in cart.'));
    }
    cart.items[itemIndex].quantity = qty;
  }

  cart.totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cart.updatedAt = new Date().toISOString();

  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Cart updated.',
    cart,
  });
});

export const removeFromCart = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return next(new ApiError(401, 'Not authenticated.'));

  const watchId = req.params.watchId as string;
  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) return next(new ApiError(404, 'Cart not found.'));

  cart.items = cart.items.filter((item) => item.watchId !== watchId);
  cart.totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cart.updatedAt = new Date().toISOString();

  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Item removed from cart.',
    cart,
  });
});

export const clearCart = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return next(new ApiError(401, 'Not authenticated.'));

  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) return next(new ApiError(404, 'Cart not found.'));

  cart.items = [];
  cart.totalAmount = 0;
  cart.updatedAt = new Date().toISOString();

  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Cart cleared.',
    cart,
  });
});
