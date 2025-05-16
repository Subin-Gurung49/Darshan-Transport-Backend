import { Router } from 'express';
import deliveryRoutes from '@routes/delivery.routes';
import { getDeliveryStatus } from '@controllers/delivery/deliveryStatus.controller';

const router = Router();

router.use('/delivery', deliveryRoutes);

// Add new route for delivery status
router.get('/delivery-status', getDeliveryStatus);

export default router;