import { Response, NextFunction } from 'express';
import { Order, Cart } from '../models/index.js';
import { AuthRequest } from '../types/index.js';
import { ApiError, asyncHandler } from '../utils/apiError.js';

export const createOrder = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return next(new ApiError(401, 'Not authenticated.'));

  const { items, shippingAddress, paymentMethod = 'Credit Card' } = req.body;

  let orderItems: any[] = [];

  if (items && items.length > 0) {
    orderItems = items;
  } else {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart || cart.items.length === 0) {
      return next(new ApiError(400, 'Your cart is empty.'));
    }
    orderItems = cart.items.map((ci: any) => ({
      watchId: ci.watchId,
      name: ci.watchName,
      price: ci.price,
      quantity: ci.quantity,
      image: ci.watchImage,
    }));
  }

  if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.country) {
    return next(new ApiError(400, 'Valid shipping address is required.'));
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Number((subtotal * 0.08).toFixed(2));
  const shippingFee = subtotal > 5000 ? 0 : 150;
  const totalAmount = Number((subtotal + tax + shippingFee).toFixed(2));

  const newOrder = {
    id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId: req.user.id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    subtotal,
    tax,
    shippingFee,
    totalAmount,
    status: 'pending' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await Order.create(newOrder as any);

  await Cart.findOneAndUpdate({ userId: req.user.id }, { items: [], totalAmount: 0, updatedAt: new Date().toISOString() });

  res.status(201).json({
    success: true,
    message: 'Order created successfully.',
    order: newOrder,
  });
});

export const getMyOrders = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return next(new ApiError(401, 'Not authenticated.'));

  const orders = await Order.find({ userId: req.user.id });

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

export const getOrderById = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return next(new ApiError(401, 'Not authenticated.'));

  const id = req.params.id as string;
  const order = await Order.findOne({ id });

  if (!order) {
    return next(new ApiError(404, `Order with ID ${id} not found.`));
  }

  if (req.user.role !== 'admin' && order.userId !== req.user.id) {
    return next(new ApiError(403, 'Access denied. You do not own this order.'));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

export const getAllOrders = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const orders = await Order.find();

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

export const updateOrderStatus = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const id = req.params.id as string;
  const { status } = req.body;

  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!status || !validStatuses.includes(status)) {
    return next(new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`));
  }

  const updatedOrder = await Order.findOneAndUpdate(
    { id },
    { status, updatedAt: new Date().toISOString() },
    { new: true }
  );

  if (!updatedOrder) {
    return next(new ApiError(404, `Order with ID ${id} not found.`));
  }

  res.status(200).json({
    success: true,
    message: 'Order status updated.',
    order: updatedOrder,
  });
});
