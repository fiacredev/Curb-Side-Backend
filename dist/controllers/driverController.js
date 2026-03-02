import * as driverService from "../services/driverService.js";
import Location from "../models/Location.js";
import Driver from "../models/Driver.js";
import mongoose from "mongoose";
export const updateLocation = async (req, res) => {
    const { driverId, lat, lng } = req.body;
    const driver = await driverService.updateLocation(driverId, lat, lng);
    res.json(driver);
};
export const toggleAvailability = async (req, res) => {
    const driver = await driverService.toggleAvailability(req.params.id);
    res.json(driver);
};
export const fetchCurrentLocation = async (req, res) => {
    const driverId = req.params.id;
    // validate objectId
    if (!mongoose.Types.ObjectId.isValid(driverId)) {
        res.status(400).json({ error: 'Invalid driver ID' });
        return;
    }
    try {
        const location = await Location
            .findOne({ driver: new mongoose.Types.ObjectId(driverId) })
            .sort({ timestamp: -1 });
        if (!location) {
            res.status(404).json({ message: 'no location found for this driver' });
            return;
        }
        res.json(location);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server error' });
    }
};
export const getNearbyDrivers = async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) {
            res.status(400).json({ message: "Missing lat or lng" });
            return;
        }
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const drivers = await Driver.find({
            isAvailable: true,
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [longitude, latitude] },
                    $maxDistance: 5000,
                },
            },
        });
        res.json(drivers);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
