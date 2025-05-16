import { Router } from 'express';
import deliveryRoutes from '@routes/delivery.routes';

const router = Router();

router.use('/delivery', deliveryRoutes);

export default router;