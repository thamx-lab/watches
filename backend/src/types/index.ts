import { Request } from 'express';

export type UserRole = 'admin' | 'customer';

export interface IUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IWatch {
  id: string;
  name: string;
  brand: string;
  referenceNumber: string;
  price: number;
  currency: string;
  description: string;
  overview: string;
  conclusion: string;
  caseMaterial: string;
  strapMaterial: string;
  waterResistance: string;
  movement: string;
  dialColor: string;
  caseSize: string;
  category: string;
  theme: 'classic' | 'modern' | 'sport' | 'vintage';
  stock: number;
  images: string[];
  featured: boolean;
  rating: number;
  reviewCount: number;
  establishedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICartItem {
  watchId: string;
  quantity: number;
  price: number;
  watchName: string;
  watchImage: string;
}

export interface ICart {
  userId: string;
  items: ICartItem[];
  totalAmount: number;
  updatedAt: string;
}

export interface IOrderItem {
  watchId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface IOrder {
  id: string;
  userId: string;
  items: IOrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  subtotal: number;
  tax: number;
  shippingFee: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IReview {
  id: string;
  watchId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface MediaAbout {
  overview: string;
  conclusion: string;
}

export interface MediaContent {
  src: string;
  poster?: string;
  background: string;
  title: string;
  date: string;
  scrollToExpand: string;
  about: MediaAbout;
}

export interface MediaContentCollection {
  [key: string]: MediaContent;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}
