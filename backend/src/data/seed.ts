import { db } from './db.js';
import { logger } from '../utils/logger.js';

logger.info('Seeding database with fresh initial data...');
db.seed();
logger.info('Database seeded successfully!');
process.exit(0);
