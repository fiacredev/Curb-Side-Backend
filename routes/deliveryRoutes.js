import express from 'express';
import * as controller from '../controllers/deliveryController.js';

const router = express.Router();

router.post('/', controller.createDelivery);
router.patch('/:id/status', controller.updateStatus);

export default router;
