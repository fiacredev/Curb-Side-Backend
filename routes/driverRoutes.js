import express from 'express';
import * as controller from '../controllers/driverController.js';

const router = express.Router();

router.post('/location', controller.updateLocation);
router.patch('/:id/toggle', controller.toggleAvailability);

export default router;
