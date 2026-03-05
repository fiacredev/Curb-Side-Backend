import express from 'express';
import * as controller from '../controllers/deliveryController.js';
const router = express.Router();
router.get("/:customerId", controller.getCustomerDeliveries);
router.get("/nearby", controller.getNearbyDeliveries);
router.post('/', controller.createDelivery);
router.patch('/:id/status', controller.updateStatus);
export default router;
