import Location from "../models/Location.js";
import Driver from "../models/Driver.js";
import Delivery from "../models/Delivery.js";

export const updateLocation = async (driverId, lat, lng) => {
  return await Driver.findByIdAndUpdate(
    driverId,
    { currentLocation: { lat, lng } },
    { new: true }
  );
};

export const toggleAvailability = async (driverId) => {
  const driver = await Driver.findById(driverId);
  driver.isAvailable = !driver.isAvailable;
  return driver.save();
};
