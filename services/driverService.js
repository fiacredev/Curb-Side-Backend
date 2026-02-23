import Location from "../models/Location.js";
import Driver from "../models/Driver.js";
import Delivery from "../models/Delivery.js";

export const updateLocation = async (driverId, lat, lng) => {
console.log("received driver id is: ", driverId);
const driver = await Driver.findById(driverId);
if (!driver) throw new Error("Driver not found");
  // dela with printing all drivers
  const drivers = await Driver.find();
  console.log("drivers received: ", drivers);
  const activeDelivery = await Delivery.findOne({
    driver: driver._id,
    status: "in_progress"
  });

  if (driver.isAvailable || activeDelivery) {
    driver.currentLocation = { lat, lng };
    await driver.save();
    await Location.create({ driver: driver._id, lat, lng });
    return driver;
  } else {
    console.log("Tracking skipped");
    return driver;
  }
};


export const toggleAvailability = async (driverId) => {
  const driver = await Driver.findById(driverId);
  driver.isAvailable = !driver.isAvailable;
  return driver.save();
};

export const updateLocationRealtime = async (driverId, lat, lng) => {
  // update drivr curent position
  const driver = await Driver.findByIdAndUpdate(
    driverId,
    { currentLocation: { lat, lng } },
    { new: true },
    // { returnDocument: 'after' }
  );

  // save history snapshot
  await Location.create({
    driver: driverId,
    lat,
    lng,
  });

  return driver;
};