import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, UserRole } from '../types/index.js';
import { ApiError } from '../utils/apiError.js';
import { db } from '../data/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'luxury_watches_super_secret_jwt_key_2026';

export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Access denied. No authentication token provided.'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: UserRole };
    
    const user = db.getUserById(decoded.id);
    if (!user) {
      return next(new ApiError(401, 'Invalid authentication token. User no longer exists.'));
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    return next(new ApiError(401, 'Invalid or expired authentication token.'));
  }
};

export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'User is not authenticated.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Permission denied. You do not have access to perform this action.'));
    }

    next();
  };
};
