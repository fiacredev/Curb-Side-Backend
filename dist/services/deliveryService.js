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
// Ai complex logic without using GEOJSONn in mongoDb to get nearest location
export const getNearbyDeliveries = async (lat, lng, radiusMeters = 5000 // default 5km
) => {
    const earthRadius = 6371000; // in meters
    return await Delivery.aggregate([
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
                                            1,
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
        { $match: { distance: { $lte: radiusMeters }, status: "pending" } },
        { $sort: { distance: 1 } },
    ]);
};
