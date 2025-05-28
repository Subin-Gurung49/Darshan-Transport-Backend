import rateLimit from 'express-rate-limit';
import { AppError, ErrorTypes } from './errorHandler.middleware';

export const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 requests per minute
    handler: (req, res, next) => {
        next(new AppError(
            'Too many requests, please try again later.',
            429,
            ErrorTypes.BUSINESS_ERROR,
            { windowMs: 60 * 1000, maxRequests: 10 }
        ));
    }
});
