import express from 'express';
import * as controller from '../controllers/driverController.js';
import mongoose from 'mongoose';
import Location from '../models/Location.js';
const router = express.Router();
router.post('/location', controller.updateLocation);
router.patch('/:id/toggle', controller.toggleAvailability);
router.get("/nearby", controller.getNearbyDrivers);
router.get('/:id/location', controller.fetchCurrentLocation);
router.post("/test-location", async (req, res) => {
    const { driverId, lat, lng } = req.body;
    if (!driverId || lat == null || lng == null) {
        return res.status(400).json({ error: "driverId, lat, lng are required" });
    }
    try {
        const location = await Location.create({
            driver: new mongoose.Types.ObjectId(driverId),
            location: { type: "Point", coordinates: [lng, lat] },
        });
        return res.json({ message: "Location saved", location });
    }
    catch (err) {
        console.error("Failed to save location:", err);
        return res.status(500).json({ error: "Failed to save location" });
    }
});
export default router;
