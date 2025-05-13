import { Router } from 'express';
import { Request, Response } from 'express';
import { 
  checkDeliveryStatus,  
} from '../controllers/delivery.controller';
import { getAllSeries } from '@services/series.service';

const router = Router();

router.get('/series', async (req: Request, res: Response) => {
  try {
    const series = await getAllSeries();
    res.json(series);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch series' });
  }
});

router.get('/status/:series/:invoiceNumber', async (req: Request, res: Response) => {
  const { series, invoiceNumber } = req.params;
  const status = await checkDeliveryStatus(series, invoiceNumber);
  res.json(status);
});

export default router;