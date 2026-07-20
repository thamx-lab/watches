import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { IUser, IWatch, MediaContentCollection, ICart, IOrder, IReview } from '../types/index.js';
import { initialUsers, initialWatches, initialMediaContent, initialOrders, initialReviews } from './seedData.js';
import { logger } from '../utils/logger.js';

interface DatabaseSchema {
  users: IUser[];
  watches: IWatch[];
  mediaContent: MediaContentCollection;
  carts: ICart[];
  orders: IOrder[];
  reviews: IReview[];
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

class JSONDatabase {
  private data: DatabaseSchema = {
    users: [],
    watches: [],
    mediaContent: {},
    carts: [],
    orders: [],
    reviews: [],
  };

  constructor() {
    this.init();
  }

  private init(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        this.data = JSON.parse(raw);
        logger.info('Database loaded from store.json');
      } else {
        this.seed();
      }
    } catch (error) {
      logger.error('Error initializing database file, resetting to seed data:', error);
      this.seed();
    }
  }

  public seed(): void {
    this.data = {
      users: [...initialUsers],
      watches: [...initialWatches],
      mediaContent: { ...initialMediaContent },
      carts: [],
      orders: [...initialOrders],
      reviews: [...initialReviews],
    };
    this.save();
    logger.info('Database initialized with default seed data.');
  }

  public save(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(STORE_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (error) {
      logger.error('Failed to save store.json:', error);
    }
  }

  // User operations
  public getUsers(): IUser[] {
    return this.data.users;
  }

  public getUserById(id: string): IUser | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public getUserByEmail(email: string): IUser | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public addUser(user: IUser): IUser {
    this.data.users.push(user);
    this.save();
    return user;
  }

  public updateUser(id: string, updates: Partial<IUser>): IUser | undefined {
    const index = this.data.users.findIndex((u) => u.id === id);
    if (index === -1) return undefined;
    this.data.users[index] = { ...this.data.users[index], ...updates, updatedAt: new Date().toISOString() };
    this.save();
    return this.data.users[index];
  }

  // Watch operations
  public getWatches(): IWatch[] {
    return this.data.watches;
  }

  public getWatchById(id: string): IWatch | undefined {
    return this.data.watches.find((w) => w.id === id);
  }

  public addWatch(watch: IWatch): IWatch {
    this.data.watches.push(watch);
    this.save();
    return watch;
  }

  public updateWatch(id: string, updates: Partial<IWatch>): IWatch | undefined {
    const index = this.data.watches.findIndex((w) => w.id === id);
    if (index === -1) return undefined;
    this.data.watches[index] = { ...this.data.watches[index], ...updates, updatedAt: new Date().toISOString() };
    this.save();
    return this.data.watches[index];
  }

  public deleteWatch(id: string): boolean {
    const index = this.data.watches.findIndex((w) => w.id === id);
    if (index === -1) return false;
    this.data.watches.splice(index, 1);
    this.save();
    return true;
  }

  // Media / Theme showcase
  public getMediaContentCollection(): MediaContentCollection {
    return this.data.mediaContent;
  }

  public getMediaContentByTheme(themeKey: string) {
    return this.data.mediaContent[themeKey] || this.data.mediaContent['classic'];
  }

  public setMediaContent(themeKey: string, content: any) {
    this.data.mediaContent[themeKey] = content;
    this.save();
  }

  // Cart operations
  public getCartByUserId(userId: string): ICart {
    let cart = this.data.carts.find((c) => c.userId === userId);
    if (!cart) {
      cart = {
        userId,
        items: [],
        totalAmount: 0,
        updatedAt: new Date().toISOString(),
      };
      this.data.carts.push(cart);
      this.save();
    }
    return cart;
  }

  public saveCart(cart: ICart): ICart {
    const index = this.data.carts.findIndex((c) => c.userId === cart.userId);
    cart.updatedAt = new Date().toISOString();
    cart.totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (index === -1) {
      this.data.carts.push(cart);
    } else {
      this.data.carts[index] = cart;
    }
    this.save();
    return cart;
  }

  // Order operations
  public getOrders(): IOrder[] {
    return this.data.orders;
  }

  public getOrdersByUserId(userId: string): IOrder[] {
    return this.data.orders.filter((o) => o.userId === userId);
  }

  public getOrderById(id: string): IOrder | undefined {
    return this.data.orders.find((o) => o.id === id);
  }

  public addOrder(order: IOrder): IOrder {
    this.data.orders.push(order);
    this.save();
    return order;
  }

  public updateOrderStatus(id: string, status: IOrder['status']): IOrder | undefined {
    const index = this.data.orders.findIndex((o) => o.id === id);
    if (index === -1) return undefined;
    this.data.orders[index].status = status;
    this.data.orders[index].updatedAt = new Date().toISOString();
    this.save();
    return this.data.orders[index];
  }

  // Review operations
  public getReviewsByWatchId(watchId: string): IReview[] {
    return this.data.reviews.filter((r) => r.watchId === watchId);
  }

  public addReview(review: IReview): IReview {
    this.data.reviews.push(review);
    
    // Update watch aggregate rating
    const watchReviews = this.getReviewsByWatchId(review.watchId);
    const totalRating = watchReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Number((totalRating / watchReviews.length).toFixed(1));
    this.updateWatch(review.watchId, {
      rating: avgRating,
      reviewCount: watchReviews.length,
    });

    this.save();
    return review;
  }
}

export const db = new JSONDatabase();
