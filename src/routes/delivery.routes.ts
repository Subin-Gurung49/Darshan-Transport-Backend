import { Router, Request, Response } from 'express';
import { checkDeliveryStatus } from '@services/delivery/delivery.service';
import { getSeriesList } from '@controllers/series/series.controller';
import { sendError, sendSuccess } from '@utils/apiResponse';
import { validateDeliveryStatus, validateRequest } from '@middleware/validation.middleware';

const router = Router();

router.get('/series', getSeriesList);

router.get('/status/:series/:invoiceNumber', 
  validateDeliveryStatus, 
  validateRequest,
  async (req: Request, res: Response) => {
    const { series, invoiceNumber } = req.params;

    try {
      const status = await checkDeliveryStatus(series, invoiceNumber);
      return sendSuccess(res, status);
    } catch (error) {
      console.error('Error fetching delivery status:', error);
      return sendError(res, error, 'Failed to fetch delivery status', 500);
    }
});

export default router;