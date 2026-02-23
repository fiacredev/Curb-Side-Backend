import Delivery from '../models/Delivery.js';

export const createDelivery = async (data) => {
  return await Delivery.create(data);
};

export const updateStatus = async (id, status) => {
  return await Delivery.findByIdAndUpdate(id, { status }, { new: true });
};
