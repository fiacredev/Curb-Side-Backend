import * as deliveryService from '../services/deliveryService.js';
import Driver from '../models/Driver.js';

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

export const createTestDriver = async (req, res) => {
  const driver = await Driver.create({
    name: "Test Driver",
    isAvailable: true,
    currentLocation: { lat: 0, lng: 0 }
  });

  res.json(driver);
};