import { Response } from 'express';

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: any;
}

export const sendResponse = (
  res: Response,
  statusCode: number,
  success: boolean,
  message?: string,
  data?: any,
  error?: any
): void => {
  const response: ApiResponse = { success };
  
  if (message) response.message = message;
  if (data) response.data = data;
  if (error) response.error = error;

  res.status(statusCode).json(response);
};

export const sendSuccess = (res: Response, data?: any, message = 'Success') => {
  sendResponse(res, 200, true, message, data);
};

export const sendError = (res: Response, error?: any, message = 'Error occurred', statusCode = 500) => {
  sendResponse(res, statusCode, false, message, undefined, error);
};