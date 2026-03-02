import Delivery, { IDelivery } from '../models/Delivery.js';
import mongoose from 'mongoose';

interface CreateDeliveryDTO {
  customer: mongoose.Types.ObjectId | string;
  driver: mongoose.Types.ObjectId | string;
  pickup: { lat: number; lng: number };
  dropoff: { lat: number; lng: number };
  status?: 'pending' | 'accepted' | 'in_progress' | 'completed';
}

export const createDelivery = async (data: CreateDeliveryDTO): Promise<IDelivery> => {
  return await Delivery.create(data);
};

export const updateStatus = async (
  id: string,
  status: 'pending' | 'accepted' | 'in_progress' | 'completed'
): Promise<IDelivery | null> => {
  return await Delivery.findByIdAndUpdate(id, { status }, { new: true });
};