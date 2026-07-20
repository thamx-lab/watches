import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../data/db.js';
import { AuthRequest, IUser } from '../types/index.js';
import { ApiError, asyncHandler } from '../utils/apiError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'luxury_watches_super_secret_jwt_key_2026';
const JWT_EXPIRES_IN = '7d';

const generateToken = (id: string, email: string, role: string) => {
  return jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const register = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ApiError(400, 'Please provide name, email, and password.'));
  }

  const existingUser = db.getUserByEmail(email);
  if (existingUser) {
    return next(new ApiError(400, 'User with this email already exists.'));
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser: IUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name,
    email,
    passwordHash,
    role: 'customer',
    avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.addUser(newUser);

  const token = generateToken(newUser.id, newUser.email, newUser.role);
  const { passwordHash: _, ...userWithoutPassword } = newUser;

  res.status(201).json({
    success: true,
    message: 'User registered successfully.',
    token,
    user: userWithoutPassword,
  });
});

export const login = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError(400, 'Please provide email and password.'));
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    return next(new ApiError(401, 'Invalid email or password.'));
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return next(new ApiError(401, 'Invalid email or password.'));
  }

  const token = generateToken(user.id, user.email, user.role);
  const { passwordHash: _, ...userWithoutPassword } = user;

  res.status(200).json({
    success: true,
    message: 'Login successful.',
    token,
    user: userWithoutPassword,
  });
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ApiError(401, 'Not authenticated.'));
  }

  const user = db.getUserById(req.user.id);
  if (!user) {
    return next(new ApiError(404, 'User not found.'));
  }

  const { passwordHash: _, ...userWithoutPassword } = user;

  res.status(200).json({
    success: true,
    user: userWithoutPassword,
  });
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ApiError(401, 'Not authenticated.'));
  }

  const { name, avatar } = req.body;
  const updates: Partial<IUser> = {};
  if (name) updates.name = name;
  if (avatar) updates.avatar = avatar;

  const updatedUser = db.updateUser(req.user.id, updates);
  if (!updatedUser) {
    return next(new ApiError(404, 'User not found.'));
  }

  const { passwordHash: _, ...userWithoutPassword } = updatedUser;

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    user: userWithoutPassword,
  });
});
