import { Router } from 'express';
import { checkDeliveryStatus } from '@services/delivery/delivery.service';
import { getSeriesList } from '@controllers/series/series.controller';
import { getDeliveryStatus } from '@controllers/delivery/deliveryStatus.controller';

const router = Router();

router.get('/series', getSeriesList);

router.get('/status/:series/:invoiceNumber', async (req, res) => {
  const { series, invoiceNumber } = req.params;
  const status = await checkDeliveryStatus(series, invoiceNumber);
  res.json(status);
});

router.get('/delivery-status', getDeliveryStatus);

export default router;