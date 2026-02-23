import * as driverService from "../services/driverService.js";
import Location from "../models/Location.js";
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
    return res.status(400).json({ error: 'Invalid driver ID' });
  }
  try {
    const location = await Location
      .findOne({ driver: new mongoose.Types.ObjectId(driverId) })
      .sort({ timestamp: -1 });

    if (!location) {
      return res.status(404).json({ message: 'no location found for this driver' });
    }
    res.json(location);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
};