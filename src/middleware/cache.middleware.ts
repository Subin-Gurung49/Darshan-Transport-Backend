import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

// Extend the Response type to include sendResponse
import { Response as ExpressResponse } from 'express';
declare module 'express-serve-static-core' {
    interface Response {
        sendResponse?: (body: any) => ExpressResponse;
    }
}

const redisClient = new Redis();

export const cacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const key = `search:${req.query.q}`;

    redisClient.get(key).then((cachedData) => {
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }

        res.sendResponse = res.json.bind(res);
        res.json = (body: any) => {
            redisClient.setex(key, 3600, JSON.stringify(body)); // Cache for 1 hour
            return res.sendResponse!(body);
        };

        next();
    }).catch((err) => {
        console.error('Redis error:', err);
        next();
    });
};
