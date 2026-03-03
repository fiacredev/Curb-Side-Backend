import * as deliveryService from "../services/deliveryService.js";
export const createDelivery = async (req, res) => {
    try {
        const delivery = await deliveryService.createDelivery(req.body);
        res.json(delivery);
    }
    catch (err) {
        console.error("Failed to create delivery:", err);
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
