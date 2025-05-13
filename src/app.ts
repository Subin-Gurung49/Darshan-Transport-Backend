import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectToDatabase } from './config/db';
import router from './routes';

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', router);

// Database connection
connectToDatabase().catch(err => {
  console.error('Database connection error', err);
  process.exit(1);
});

export default app;