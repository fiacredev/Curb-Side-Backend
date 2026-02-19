import * as driverService from "../Services/driverService.js"
import Location from "../models/Location.js";

export const updateLocation = async (req, res) => {
  const { driverId, lat, lng } = req.body;
  const driver = await driverService.updateLocation(driverId, lat, lng);
  res.json(driver);
};

export const toggleAvailability = async (req, res) => {
  const driver = await driverService.toggleAvailability(req.params.id);
  res.json(driver);
};

export const fetchCurrentLocation = async (req,res) =>{
  const location = await Location
    .findOne({ driver: req.params.id })
    .sort({ timestamp: -1 });

  res.json(location);
}
