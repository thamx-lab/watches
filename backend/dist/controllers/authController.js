import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { ApiError, asyncHandler } from '../utils/apiError.js';
import { sendN8nWebhook } from '../utils/n8nWebhook.js';
const JWT_SECRET = process.env.JWT_SECRET || 'luxury_watches_super_secret_jwt_key_2026';
const JWT_EXPIRES_IN = '7d';
const generateToken = (id, email, role) => {
    return jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
export const register = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
        return next(new ApiError(400, 'Please provide a valid full name.'));
    }

    const cleanName = name.trim();
    if (cleanName.length < 2 || cleanName.length > 70) {
        return next(new ApiError(400, 'Full name must be between 2 and 70 characters.'));
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return next(new ApiError(400, 'Please provide a valid email address.'));
    }

    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail.length > 255) {
        return next(new ApiError(400, 'Email address is too long.'));
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
        return next(new ApiError(400, 'Password must be at least 6 characters long.'));
    }

    if (password.length > 128) {
        return next(new ApiError(400, 'Password must not exceed 128 characters.'));
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
        return next(new ApiError(400, 'User with this email already exists.'));
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: cleanName,
        email: cleanEmail,
        passwordHash,
        role: 'customer',
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const createdUser = await User.create(newUser);

    // Trigger n8n Webhook for registration
    sendN8nWebhook('register', { name: createdUser.name, email: createdUser.email });

    const token = generateToken(createdUser.id, createdUser.email, createdUser.role);
    const userObj = createdUser.toObject();
    const { passwordHash: _, ...userWithoutPassword } = userObj;

    res.status(201).json({
        success: true,
        message: 'User registered successfully.',
        token,
        user: userWithoutPassword,
    });
});

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return next(new ApiError(400, 'Please provide a valid email address.'));
    }

    if (!password || typeof password !== 'string') {
        return next(new ApiError(400, 'Please provide your password.'));
    }

    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail.length > 255 || password.length > 128) {
        return next(new ApiError(400, 'Invalid credentials format.'));
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
        return next(new ApiError(401, 'Invalid email or password.'));
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        return next(new ApiError(401, 'Invalid email or password.'));
    }

    // Trigger n8n Webhook for login
    sendN8nWebhook('login', { name: user.name, email: user.email });

    const token = generateToken(user.id, user.email, user.role);
    const userObj = user.toObject();
    const { passwordHash: _, ...userWithoutPassword } = userObj;

    res.status(200).json({
        success: true,
        message: 'Login successful.',
        token,
        user: userWithoutPassword,
    });
});

export const getMe = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new ApiError(401, 'Not authenticated.'));
    }
    const user = await User.findOne({ id: req.user.id });
    if (!user) {
        return next(new ApiError(404, 'User not found.'));
    }
    const userObj = user.toObject();
    const { passwordHash: _, ...userWithoutPassword } = userObj;
    res.status(200).json({
        success: true,
        user: userWithoutPassword,
    });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new ApiError(401, 'Not authenticated.'));
    }
    const { name, avatar } = req.body;
    const updates = { updatedAt: new Date().toISOString() };
    if (name) {
        if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 70) {
            return next(new ApiError(400, 'Name must be between 2 and 70 characters.'));
        }
        updates.name = name.trim();
    }
    if (avatar) {
        if (typeof avatar !== 'string' || !/^https?:\/\/.+/.test(avatar)) {
            return next(new ApiError(400, 'Avatar must be a valid URL.'));
        }
        updates.avatar = avatar;
    }
    const updatedUser = await User.findOneAndUpdate({ id: req.user.id }, updates, { new: true });
    if (!updatedUser) {
        return next(new ApiError(404, 'User not found.'));
    }
    const userObj = updatedUser.toObject();
    const { passwordHash: _, ...userWithoutPassword } = userObj;
    res.status(200).json({
        success: true,
        message: 'Profile updated successfully.',
        user: userWithoutPassword,
    });
});
