import Delivery, { IDelivery } from '../models/Delivery.js';
import transporter from '../utils/mailer.js';
import mongoose from 'mongoose';

interface CreateDeliveryDTO {
  customer: mongoose.Types.ObjectId | string;
  customerEmail:string,
  driverEmail:string,
  driver: mongoose.Types.ObjectId | string;
  pickup: { lat: number; lng: number };
  dropoff: { lat: number; lng: number };
  status?: 'pending' | 'accepted' | 'in_progress' | 'completed';
}

export const createDelivery = async (data: CreateDeliveryDTO): Promise<IDelivery> => {
  return await Delivery.create(data);
};

export const sendDeliveryCreatedEmail = async (
    pickup: any,
    dropoff: any,
    customerEmail:string,
    // email: string = "pitytrapper@gmail.com",
) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: customerEmail,
    subject: "Delivery Created",
    html: `
      <h2>Delivery Confirmation</h2>
      <p>Pickup: ${pickup.lat}, ${pickup.lng}</p>
      <p>Dropoff: ${dropoff.lat}, ${dropoff.lng}</p>
      <h3>Thank You for Your Trust</h3>
      <p>
      We’re pleased to confirm that your delivery has been successfully completed. 
      It was our absolute pleasure to handle this task for you. We truly appreciate the opportunity 
      to serve you and remain committed to providing reliable, timely, and professional service every time. 
      </p>
      <p>
      If there’s anything more you need or if we can assist you further, 
      please don’t hesitate to reach out. We look forward to working with you again soon!
      </p>
    `,
  });
};

export const updateStatus = async (
  id: string,
  status: 'pending' | 'accepted' | 'in_progress' | 'completed'
): Promise<IDelivery | null> => {
  return await Delivery.findByIdAndUpdate(id, { status }, { new: true });
};