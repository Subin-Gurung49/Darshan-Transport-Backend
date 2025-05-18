import express from "express";
import routes from "@routes/index";
import cors from "cors";
import morgan from "morgan";
import { globalErrorHandler } from '@middleware/errorHandler.middleware';

const app = express();

// Apply middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

// Error handling middleware (should be last)
app.use(globalErrorHandler);

export default app;
