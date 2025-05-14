import { Router } from 'express';
import deliveryRoutes from './delivery.routes';
import { getDeliveryStatus } from '../controllers/deliveryStatus.controller';

const router = Router();

router.use('/delivery', deliveryRoutes);

// Add new route for delivery status
router.get('/delivery-status', getDeliveryStatus);

export default router;