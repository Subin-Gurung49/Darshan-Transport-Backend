import { Router, Request, Response, NextFunction } from 'express';
import { checkDeliveryStatus } from '../services/delivery/delivery.service';
import { getSeriesList } from '../controllers/series/series.controller';
import { sendSuccess } from '../utils/apiResponse';
import { validateDeliveryStatus, validateRequest } from '../middleware/validation.middleware';
import { AppError, ErrorTypes } from '../middleware/errorHandler.middleware';

const router = Router();

router.get('/series', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getSeriesList(req, res, next);
    if (result?.data) {
      sendSuccess(res, result.data);
    }
  } catch (error) {
    next(error);
  }
});

router.get('/status/:series/:invoiceNumber', 
  validateDeliveryStatus, 
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { series, invoiceNumber } = req.params;
      const status = await checkDeliveryStatus(series, invoiceNumber);
      
      if (!status) {
        throw new AppError(
          'Delivery not found', 
          404, 
          ErrorTypes.NOT_FOUND,
          { series, invoiceNumber }
        );
      }
      
      sendSuccess(res, status);
    } catch (error) {
      next(error);
    }
});

export default router;