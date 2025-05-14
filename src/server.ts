import 'module-alias/register';
import './module-alias';
import app from './app';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import Redis from 'ioredis';
import { Request, Response, NextFunction } from 'express';
import { connectToDatabase } from './config/db';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize Redis client
const redisClient = new Redis();

// Fix for extending the Response object
import { Response as ExpressResponse } from 'express';

declare module 'express-serve-static-core' {
    interface Response {
        sendResponse?: ExpressResponse['json'];
    }
}

// Adjusted middleware to avoid returning a Promise directly
const cacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const key = `search:${req.query.q}`;

    redisClient.get(key).then((cachedData) => {
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }

        res.sendResponse = res.json.bind(res);
        res.json = (body) => {
            redisClient.setex(key, 3600, JSON.stringify(body)); // Cache for 1 hour
            return res.sendResponse!(body);
        };

        next();
    }).catch((err) => {
        console.error('Redis error:', err);
        next();
    });
};

// Rate limiter configuration
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 requests per minute
    message: 'Too many requests, please try again later.',
});

// Apply rate limiter and caching middleware to search route
app.use('/search', limiter, cacheMiddleware);

// Establish database connection
connectToDatabase().catch((err) => {
  console.error('Failed to connect to the database:', err);
  process.exit(1); // Exit the process if the database connection fails
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});