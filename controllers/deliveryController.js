import * as deliveryService from '../services/deliveryService.js';

export const createDelivery = async (req, res) => {
  const delivery = await deliveryService.createDelivery(req.body);
  res.json(delivery);
};

export const updateStatus = async (req, res) => {
  const delivery = await deliveryService.updateStatus(
    req.params.id,
    req.body.status
  );
  res.json(delivery);
};
