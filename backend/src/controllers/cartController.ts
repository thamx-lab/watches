import { Response, NextFunction } from 'express';
import { db } from '../data/db.js';
import { AuthRequest } from '../types/index.js';
import { ApiError, asyncHandler } from '../utils/apiError.js';

export const getCart = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return next(new ApiError(401, 'Not authenticated.'));

  const cart = db.getCartByUserId(req.user.id);

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

  const watch = db.getWatchById(watchId);
  if (!watch) {
    return next(new ApiError(404, 'Watch not found.'));
  }

  const cart = db.getCartByUserId(req.user.id);
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

  const updatedCart = db.saveCart(cart);

  res.status(200).json({
    success: true,
    message: 'Item added to cart.',
    cart: updatedCart,
  });
});

export const updateCartItemQuantity = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return next(new ApiError(401, 'Not authenticated.'));

  const watchId = req.params.watchId as string;
  const { quantity } = req.body;

  if (quantity === undefined || isNaN(Number(quantity))) {
    return next(new ApiError(400, 'Valid quantity is required.'));
  }

  const cart = db.getCartByUserId(req.user.id);
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

  const updatedCart = db.saveCart(cart);

  res.status(200).json({
    success: true,
    message: 'Cart updated.',
    cart: updatedCart,
  });
});

export const removeFromCart = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return next(new ApiError(401, 'Not authenticated.'));

  const watchId = req.params.watchId as string;
  const cart = db.getCartByUserId(req.user.id);

  cart.items = cart.items.filter((item) => item.watchId !== watchId);
  const updatedCart = db.saveCart(cart);

  res.status(200).json({
    success: true,
    message: 'Item removed from cart.',
    cart: updatedCart,
  });
});

export const clearCart = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return next(new ApiError(401, 'Not authenticated.'));

  const cart = db.getCartByUserId(req.user.id);
  cart.items = [];
  const updatedCart = db.saveCart(cart);

  res.status(200).json({
    success: true,
    message: 'Cart cleared.',
    cart: updatedCart,
  });
});
