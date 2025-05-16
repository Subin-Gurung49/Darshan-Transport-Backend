import { Router } from 'express';
import { checkDeliveryStatus } from '@services/delivery/delivery.service';
import { getSeriesList } from '@controllers/series/series.controller';
import { sendError, sendSuccess } from '@utils/apiResponse';

const router = Router();

router.get('/series', getSeriesList);

router.get('/delivery/status/:series/:invoiceNumber', async (req, res) => {
  const { series, invoiceNumber } = req.params;

  // Input validation
  if (!series || !invoiceNumber) {
    return sendError(res, undefined, 'Series and Invoice Number are required', 400);
  }

  try {
    const status = await checkDeliveryStatus(series, invoiceNumber);
    return sendSuccess(res, status);
  } catch (error) {
    console.error('Error fetching delivery status:', error);
    return sendError(res, error, 'Failed to fetch delivery status', 500);
  }
});

export default router;