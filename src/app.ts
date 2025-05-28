import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import Logger from './config/logger'; // Use relative path
import { globalErrorHandler, AppError, ErrorTypes } from './middleware/errorHandler.middleware'; // Use relative path
import { limiter } from './middleware/rateLimiter.middleware'; // Use relative path
import { cacheMiddleware } from './middleware/cache.middleware'; // Use relative path
import mainRouter from './routes/index'; // Use relative path
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

// Middlewares
app.use(helmet());
app.use(cors()); // TODO: Configure CORS for production
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define a stream object with a write method that morgan can use
const morganStream = {
  write: (message: string) => {
    Logger.http(message.trim()); // Use Logger.http for logging morgan messages
  },
};

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', { stream: morganStream }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  Logger.info('Health check accessed');
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Apply rate limiter to all /api/v1 routes
app.use('/api/v1', limiter); 
// app.use('/api/v1', cacheMiddleware); // cacheMiddleware remains commented for now

// Routes
app.use('/api/v1', mainRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  const message = `Route not found: ${req.method} ${req.originalUrl}`;
  Logger.warn(message);
  next(new AppError(message, 404, ErrorTypes.NOT_FOUND)); 
});

app.use(globalErrorHandler);

export default app;
