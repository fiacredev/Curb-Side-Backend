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
// export const getNearbyDeliveries = async (
//   lat: number,
//   lng: number,
//   radiusMeters: number = 5000
// ) => {
//   try {
//     // fetch all pending deliveries
//     const deliveries = await Delivery.find({ status: "pending" }).lean();

//     const earthRadius = 6371000; // meters

//     const haversineDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
//       const toRad = (v: number) => (v * Math.PI) / 180;
//       const dLat = toRad(lat2 - lat1);
//       const dLng = toRad(lng2 - lng1);

//       const a =
//         Math.sin(dLat / 2) ** 2 +
//         Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
//       const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//       return earthRadius * c;
//     };

//     // map deliveries with distance
//     const nearby = deliveries
//       .map((d: any) => {
//         if (d.pickup && d.pickup.lat != null && d.pickup.lng != null) {
//           const distance = haversineDistance(lat, lng, d.pickup.lat, d.pickup.lng);
//           return { ...d, distance };
//         }
//         return null;
//       })
//       .filter((d): d is any => d !== null && d.distance <= radiusMeters)
//       .sort((a, b) => a.distance - b.distance);

//     return nearby;
//   } catch (err: any) {
//     console.error("getNearbyDeliveries failed:", err);
//     throw err;
//   }
// };


// AI complex logic for calculating distance and so on...

export const getNearbyDeliveries = async (
  lat: number,
  lng: number,
  radiusMeters: number = 20000
) => {
  try {
    const deliveries = await Delivery.find({ status: "pending" }).lean();

    console.log("Total pending deliveries:", deliveries.length);
    console.log("Driver location:", lat, lng);

    const earthRadius = 6371000;

    const toRad = (v: number) => (v * Math.PI) / 180;

    const haversineDistance = (
      lat1: number,
      lng1: number,
      lat2: number,
      lng2: number
    ) => {
      const dLat = toRad(lat2 - lat1);
      const dLng = toRad(lng2 - lng1);

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLng / 2) ** 2;

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return earthRadius * c;
    };

    const nearby = deliveries.filter((delivery) => {
      if (!delivery.pickup || delivery.pickup.lat == null || delivery.pickup.lng == null) {
        console.log("Skipping delivery without pickup:", delivery._id);
        return false;
      }

      const distance = haversineDistance(
        lat,
        lng,
        delivery.pickup.lat,
        delivery.pickup.lng
      );

      console.log(
        "Delivery:",
        delivery._id,
        "Pickup:",
        delivery.pickup.lat,
        delivery.pickup.lng,
        "Distance:",
        distance
      );

      return distance <= radiusMeters;
    });

    console.log("Nearby deliveries found:", nearby.length);

    return nearby;
  } catch (err) {
    console.error("Error in getNearbyDeliveries:", err);
    throw err;
  }
};