import 'module-alias/register';
import './module-alias';
import app from './app';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { connectToDatabase } from '@config/db';
import { cacheMiddleware } from '@middleware/cache.middleware';
import { limiter } from '@middleware/rateLimiter.middleware';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Apply rate limiter and caching middleware to search route
// app.use('/search', limiter, cacheMiddleware);

// Establish database connection
connectToDatabase().catch((err) => {
  console.error('Failed to connect to the database:', err);
  process.exit(1); // Exit the process if the database connection fails
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});