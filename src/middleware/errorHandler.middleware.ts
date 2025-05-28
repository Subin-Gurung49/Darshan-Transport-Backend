import { Request, Response, NextFunction } from 'express';
import { sendError } from '@utils/apiResponse'; // Use path alias
import Logger from '@config/logger'; // Use path alias

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

interface ErrorResponseDetails {
  errorCode?: string;
  details?: any;
  stack?: string;
}

// Global error handling middleware
export const globalErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  let responseStatusCode: number;
  let responseMessage: string;
  let errorDetails: ErrorResponseDetails = {};

  if (err instanceof AppError) {
    responseStatusCode = err.statusCode;
    responseMessage = err.message;
    errorDetails.errorCode = err.errorCode || ErrorTypes.BUSINESS_ERROR;
    if (err.data) {
      errorDetails.details = err.data;
    }

    Logger.warn(`AppError handled: ${err.message}`, {
      statusCode: err.statusCode,
      errorCode: errorDetails.errorCode,
      path: req.path,
      method: req.method,
      data: err.data,
      stack: isDevelopment ? err.stack : undefined
    });

  } else {
    responseStatusCode = 500;
    responseMessage = isDevelopment ? err.message : 'An unexpected server error occurred.';
    errorDetails.errorCode = ErrorTypes.SERVER_ERROR;
    if (err.name === 'SyntaxError') { 
        errorDetails.errorCode = ErrorTypes.INVALID_INPUT;
        responseStatusCode = 400; // Bad request for syntax errors
    }
    
    Logger.error('Unhandled error caught by globalErrorHandler:', {
      message: err.message,
      name: err.name,
      path: req.path,
      method: req.method,
      errorObject: err, 
      stack: err.stack 
    });
  }

  if (isDevelopment) {
    errorDetails.stack = err.stack;
  }

  // Construct the error object to be passed to sendError, ensuring errorCode is included
  const errorPayload: any = { ...errorDetails }; // Start with errorCode and stack
  if (errorDetails.details) { // If AppError had specific data, include it
    errorPayload.details = errorDetails.details;
  }

  sendError(res, errorPayload, responseMessage, responseStatusCode);
};
