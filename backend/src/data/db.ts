import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/luxury_watches');
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    logger.warn(`MongoDB Connection Warning: ${error.message}`);
    logger.warn(`Ensure MONGODB_URI is set in Render environment variables for MongoDB Atlas.`);
  }
};
