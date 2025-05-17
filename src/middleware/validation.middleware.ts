import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import { sendError } from '@utils/apiResponse';

export const validateDeliveryStatus = [
  check('series')
    .trim()
    .notEmpty().withMessage('Series is required')
    .isString().withMessage('Series must be a string')
    .matches(/^[A-Za-z0-9]+$/).withMessage('Series contains invalid characters'),
  check('invoiceNumber')
    .trim()
    .notEmpty().withMessage('Invoice number is required')
    .matches(/^\d+$/).withMessage('Invoice number must be numeric'),
];

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, errors.array(), 'Invalid input parameters', 400);
  }
  next();
};
