import { Router } from 'express';
import deliveryRoutes from './delivery.routes';

const router = Router();

router.use('/delivery', deliveryRoutes);

export default router;