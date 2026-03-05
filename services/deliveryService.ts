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

  const delivery = await Delivery.create({
    ...data,
        pickup: {
      lat: data.pickup.lat,
      lng: data.pickup.lng,
    },
    dropoff: {
      lat: data.dropoff.lat,
      lng: data.dropoff.lng,
    },
  });

  return delivery;
};

export const getCustomerDeliveries = async (customerId: string): Promise<IDelivery[]> => {
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    throw new Error("Invalid customer ID");
  }
  // fetch all deliveries for the customer most recent first
  return await Delivery.find({ customer: customerId })
    .sort({ createdAt: -1 })
    .lean();
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



  // Ai complex logic without using GEOJSONn in mongoDb to get nearest deliveries
  
  export const getNearbyDeliveries = async (
  lat: number,
  lng: number,
  radiusMeters: number = 5000 // default 5 km
) => {
  const earthRadius = 6371000; // meters

  return await Delivery.aggregate([
    // Filter out documents without proper pickup coordinates first
    {
      $match: {
        "pickup.lat": { $exists: true, $ne: null },
        "pickup.lng": { $exists: true, $ne: null },
        status: "pending",
      },
    },

    // Calculate distance using Haversine formula
    {
      $addFields: {
        distance: {
          $let: {
            vars: {
              lat1: { $toRadians: "$pickup.lat" },
              lng1: { $toRadians: "$pickup.lng" },
              lat2: { $toRadians: lat },
              lng2: { $toRadians: lng },
            },
            in: {
              $multiply: [
                earthRadius,
                {
                  $acos: {
                    $min: [
                      1, // ensures domain error doesn't happen
                      {
                        $add: [
                          { $multiply: [{ $sin: "$$lat1" }, { $sin: "$$lat2" }] },
                          {
                            $multiply: [
                              { $cos: "$$lat1" },
                              { $cos: "$$lat2" },
                              { $cos: { $subtract: ["$$lng2", "$$lng1"] } },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      },
    },

    // Only return deliveries within radius
    {
      $match: {
        distance: { $lte: radiusMeters },
      },
    },

    // Sort nearest first
    {
      $sort: { distance: 1 },
    },
  ]);
};