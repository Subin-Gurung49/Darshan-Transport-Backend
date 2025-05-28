import { Router, Request, Response, NextFunction } from 'express';
import { getSeriesList } from '../controllers/series/series.controller';
import { sendSuccess } from '../utils/apiResponse';
import { validateDeliveryStatus, validateRequest } from '../middleware/validation.middleware';
import { getDeliveryStatus } from '../controllers/delivery/deliveryStatus.controller'; // Import the controller

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
  getDeliveryStatus       // Use the adapted controller
);

export default router;