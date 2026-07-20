import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Watch, Cart, Order, Review, MediaTheme } from '../models/index.js';
import { initialUsers, initialWatches, initialMediaContent, initialOrders, initialReviews } from './seedData.js';
import { logger } from '../utils/logger.js';

dotenv.config();

const seedDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/luxury_watches');
    logger.info(`MongoDB Connected for Seeding: ${conn.connection.host}`);

    // Clear existing data
    await User.deleteMany();
    await Watch.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await MediaTheme.deleteMany();

    // Insert seed data
    await User.insertMany(initialUsers);
    await Watch.insertMany(initialWatches);
    await Order.insertMany(initialOrders);
    await Review.insertMany(initialReviews);

    // Insert Media Content
    const mediaContentDocs = Object.keys(initialMediaContent).map((themeKey) => {
      const content = (initialMediaContent as any)[themeKey];
      return { themeKey, ...content };
    });
    await MediaTheme.insertMany(mediaContentDocs);

    logger.info('Database seeded successfully!');
    process.exit(0);
  } catch (error: any) {
    logger.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
