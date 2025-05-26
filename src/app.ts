import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet'; // Import helmet
import { globalErrorHandler } from '@middleware/errorHandler.middleware';
import routes from "@routes/index";

const app: Application = express();

// Middlewares
app.use(helmet()); // Use helmet
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

// Error handling middleware (should be last)
app.use(globalErrorHandler);

export default app;
