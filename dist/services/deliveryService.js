import Delivery from '../models/Delivery.js';
import transporter from '../utils/mailer.js';
import mongoose from 'mongoose';
export const createDelivery = async (data) => {
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
export const getCustomerDeliveries = async (customerId) => {
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
        throw new Error("Invalid customer ID");
    }
    // fetch all deliveries for the customer most recent first
    return await Delivery.find({ customer: customerId })
        .sort({ createdAt: -1 })
        .lean();
};
export const sendDeliveryCreatedEmail = async (pickup, dropoff, customerEmail) => {
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
export const updateStatus = async (id, status) => {
    return await Delivery.findByIdAndUpdate(id, { status }, { new: true });
};
// Ai complex logic without using GEOJSONn in mongoDb to get nearest deliveries
export const getNearbyDeliveries = async (lat, lng, radiusMeters = 5000) => {
    try {
        // fetch all pending deliveries
        const deliveries = await Delivery.find({ status: "pending" }).lean();
        const earthRadius = 6371000; // meters
        const haversineDistance = (lat1, lng1, lat2, lng2) => {
            const toRad = (v) => (v * Math.PI) / 180;
            const dLat = toRad(lat2 - lat1);
            const dLng = toRad(lng2 - lng1);
            const a = Math.sin(dLat / 2) ** 2 +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return earthRadius * c;
        };
        // map deliveries with distance
        const nearby = deliveries
            .map((d) => {
            if (d.pickup && d.pickup.lat != null && d.pickup.lng != null) {
                const distance = haversineDistance(lat, lng, d.pickup.lat, d.pickup.lng);
                return { ...d, distance };
            }
            return null;
        })
            .filter((d) => d !== null && d.distance <= radiusMeters)
            .sort((a, b) => a.distance - b.distance);
        return nearby;
    }
    catch (err) {
        console.error("getNearbyDeliveries failed:", err);
        throw err;
    }
};
