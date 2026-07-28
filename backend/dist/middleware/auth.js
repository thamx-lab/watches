import jwt from 'jsonwebtoken';
import { ApiError, asyncHandler } from '../utils/apiError.js';
import { User } from '../models/index.js';
const JWT_SECRET = process.env.JWT_SECRET || 'luxury_watches_super_secret_jwt_key_2026';
export const authenticateUser = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new ApiError(401, 'Access denied. No authentication token provided.'));
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({ id: decoded.id });
        if (!user) {
            return next(new ApiError(401, 'Invalid authentication token. User no longer exists.'));
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        next();
    }
    catch (error) {
        return next(new ApiError(401, 'Invalid or expired authentication token.'));
    }
});
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ApiError(401, 'User is not authenticated.'));
        }
        if (!roles.includes(req.user.role)) {
            return next(new ApiError(403, 'Permission denied. You do not have access to perform this action.'));
        }
        next();
    };
};
