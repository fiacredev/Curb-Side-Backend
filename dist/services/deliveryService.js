import Delivery from '../models/Delivery.js';
import transporter from '../utils/mailer.js';
export const createDelivery = async (data) => {
    return await Delivery.create(data);
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
