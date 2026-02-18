import Location from "../models/Location.js";
import Driver from "../models/Driver.js";
import Delivery from "../models/Delivery.js";

export const updateLocation = async (driverId, lat, lng) => {
   const driver = await Driver.findById(driverId);
  if (!driver) throw new Error("Driver not found");
  // Check if driver is available or has a delivery in progress being done
  const activeDelivery = await Delivery.findOne({
    driver: driver._id,
    status: "in_progress"
  });

  if (driver.isAvailable || activeDelivery) {
    // Update driver current location to be stored effecvtively in database
    driver.currentLocation = { lat, lng };
    await driver.save();
    // Store location history of every drivr
    await Location.create({ driver: driver._id, lat, lng });
    return driver;
  } else {
    // Skip tracking automatically when all condition aboev are false
    return driver;
  }
};

export const toggleAvailability = async (driverId) => {
  const driver = await Driver.findById(driverId);
  driver.isAvailable = !driver.isAvailable;
  return driver.save();
};
