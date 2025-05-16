import { Router } from 'express';
import { checkDeliveryStatus } from '@services/delivery/delivery.service';
import { getAllSeries } from '@services/series/series.service';

const router = Router();

router.get('/series', async (req, res) => {
  try {
    const series = await getAllSeries();
    res.json(series);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch series' });
  }
});

router.get('/status/:series/:invoiceNumber', async (req, res) => {
  const { series, invoiceNumber } = req.params;
  const status = await checkDeliveryStatus(series, invoiceNumber);
  res.json(status);
});

export default router;