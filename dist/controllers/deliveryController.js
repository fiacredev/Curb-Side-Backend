import * as deliveryService from "../services/deliveryService.js";
export const createDelivery = async (req, res) => {
    try {
        const delivery = await deliveryService.createDelivery(req.body);
        // dealw with sending email after delivery created
        deliveryService.sendDeliveryCreatedEmail(req.body.pickup, req.body.dropoff, req.body.customerEmail)
            .catch(err => console.error("Email failed (ignored):", err));
        res.status(201).json(delivery);
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
