import mongoose, { Schema, Document } from 'mongoose';
import { IUser, IWatch, ICart, IOrder, IReview, MediaContent, UserRole, OrderStatus } from '../types/index.js';

// User Model
const UserSchema = new Schema<IUser>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  avatar: { type: String },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true }
});
export const User = mongoose.model<IUser>('User', UserSchema);

// Watch Model
const WatchSchema = new Schema<IWatch>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  referenceNumber: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, required: true },
  description: { type: String, required: true },
  overview: { type: String, required: true },
  conclusion: { type: String, required: true },
  caseMaterial: { type: String, required: true },
  strapMaterial: { type: String, required: true },
  waterResistance: { type: String, required: true },
  movement: { type: String, required: true },
  dialColor: { type: String, required: true },
  caseSize: { type: String, required: true },
  category: { type: String, required: true },
  theme: { type: String, enum: ['classic', 'modern', 'sport', 'vintage'], required: true },
  stock: { type: Number, required: true },
  images: [{ type: String }],
  featured: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  establishedDate: { type: String, required: true },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true }
});
export const Watch = mongoose.model<IWatch>('Watch', WatchSchema);

// Cart Model
const CartItemSchema = new Schema({
  watchId: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  watchName: { type: String, required: true },
  watchImage: { type: String, required: true }
}, { _id: false });

const CartSchema = new Schema<ICart>({
  userId: { type: String, required: true, unique: true },
  items: [CartItemSchema],
  totalAmount: { type: Number, required: true },
  updatedAt: { type: String, required: true }
});
export const Cart = mongoose.model<ICart>('Cart', CartSchema);

// Order Model
const OrderItemSchema = new Schema({
  watchId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true }
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  items: [OrderItemSchema],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentMethod: { type: String, required: true },
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  shippingFee: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], required: true },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true }
});
export const Order = mongoose.model<IOrder>('Order', OrderSchema);

// Review Model
const ReviewSchema = new Schema<IReview>({
  id: { type: String, required: true, unique: true },
  watchId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  createdAt: { type: String, required: true }
});
export const Review = mongoose.model<IReview>('Review', ReviewSchema);

// MediaContent Model
const MediaContentSchema = new Schema({
  themeKey: { type: String, required: true, unique: true },
  src: { type: String, required: true },
  poster: { type: String },
  background: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  scrollToExpand: { type: String, required: true },
  about: {
    overview: { type: String, required: true },
    conclusion: { type: String, required: true }
  }
});
export const MediaTheme = mongoose.model('MediaTheme', MediaContentSchema);
