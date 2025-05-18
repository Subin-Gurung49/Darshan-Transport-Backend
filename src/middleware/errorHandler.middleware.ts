import { Request, Response, NextFunction } from 'express';
import { sendError } from '@utils/apiResponse';

// Custom error class for handling business logic errors
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public errorCode?: string,
    public data?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    this.name = 'AppError';
  }
}

// Error types for better error handling
export enum ErrorTypes {
  // SQL Related Errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  QUERY_ERROR = 'QUERY_ERROR',

  // Business Logic Errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  BUSINESS_ERROR = 'BUSINESS_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',

  // Programming/Runtime Errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  SERVER_ERROR = 'SERVER_ERROR',
  RUNTIME_ERROR = 'RUNTIME_ERROR'
}

interface ErrorResponse {
  message: string;
  statusCode: number;
  errorCode: string;
  data?: any;
  stack?: string;
}

// Helper functions for specific error types
const handleSQLError = (err: Error): ErrorResponse => {
  switch(err.name) {
    case 'RequestError':
      return { message: 'Database operation failed', statusCode: 503, errorCode: ErrorTypes.QUERY_ERROR };
    case 'ConnectionError':
      return { message: 'Database connection failed', statusCode: 503, errorCode: ErrorTypes.CONNECTION_ERROR };
    default:
      return { message: 'Database error occurred', statusCode: 503, errorCode: ErrorTypes.DATABASE_ERROR };
  }
};

const handleBusinessError = (err: AppError): ErrorResponse => {
  return {
    message: err.message,
    statusCode: err.statusCode,
    errorCode: err.errorCode || ErrorTypes.BUSINESS_ERROR,
    data: err.data
  };
};

const handleProgrammingError = (err: Error): ErrorResponse => {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    message: isProd ? 'An unexpected error occurred' : err.message,
    statusCode: 500,
    errorCode: ErrorTypes.RUNTIME_ERROR,
    stack: isProd ? undefined : err.stack
  };
};

// Global error handling middleware
export const globalErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error for debugging
  console.error('Error:', {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  });

  let errorResponse: ErrorResponse;

  // Handle SQL Errors
  if (err.name === 'RequestError' || err.name === 'ConnectionError') {
    errorResponse = handleSQLError(err);
  }
  // Handle Business Logic Errors
  else if (err instanceof AppError) {
    errorResponse = handleBusinessError(err);
  }
  // Handle Programming/Runtime Errors
  else {
    errorResponse = handleProgrammingError(err);
  }

  return sendError(
    res,
    errorResponse.data,
    errorResponse.message,
    errorResponse.statusCode
  );
};
