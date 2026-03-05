import * as deliveryService from "../services/deliveryService.js";
import Customer from "../models/Customer.js";
export const createDelivery = async (req, res) => {
    try {
        const delivery = await deliveryService.createDelivery(req.body);
        // dealw with sending email after delivery created
        const customerRecord = await Customer.findById(req.body.customer);
        if (!customerRecord)
            throw new Error("customer not found");
        let emailSent = true;
        let emailError = null;
        // sending email efficiently
        try {
            deliveryService.sendDeliveryCreatedEmail(req.body.pickup, req.body.dropoff, customerRecord.email);
            console.log("Email sent successfully to:", customerRecord.email);
        }
        catch (emailErr) {
            console.error("Email failed:", emailErr);
            let emailSent = false;
            let emailError = null;
        }
        res.status(201).json({ delivery, emailSent, emailError });
    }
    catch (err) {
        console.error("failed to create delivery:", err);
        res.status(400).json({
            message: err.message || "server error",
        });
    }
};
// update delivery status
export const updateStatus = async (req, res) => {
    try {
        const delivery = await deliveryService.updateStatus(req.params.id, req.body.status);
        res.json(delivery);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
// export const createTestDriver = async (req, res) => {
//   const driver = await Driver.create({
//     name: "Test Driver",
//     isAvailable: true,
//     currentLocation: { lat: 0, lng: 0 }
//   });
//   res.json(driver);
// };
