import Location, { ILocation } from "../models/Location.js";
import Driver, {IDriver} from "../models/Driver.js";
import Delivery, {IDelivery}from "../models/Delivery.js";
import mongoose from "mongoose";

export const updateLocation = async ( driverId: string, lat: number, lng: number   ): Promise<IDriver>  => {
console.log("received driver id is: ", driverId);

// type mongooose query result
const driver: IDriver | null = await Driver.findById(driverId);
if (!driver) throw new Error("Driver not found");
  // dela with printing all drivers

  const drivers: IDriver[] = await Driver.find();
  console.log("drivers received: ", drivers);

  const activeDelivery: IDelivery | null = await Delivery.findOne({
    driver: driver._id,
    status: "in_progress"
  });

  if (driver.isAvailable || activeDelivery) {
     driver.location = { type: "Point",coordinates: [lng, lat] };
    await driver.save();
    await Location.create({ driver: driver._id,
      location: {
      type: "Point",
      coordinates: [lng, lat], // GeoJSON expects [longitude, latitude]
    },
    } as ILocation);
    return driver;
  } else {
    console.log("Tracking skipped");
    return driver;
  }
};


export const toggleAvailability = async (driverId: string): Promise<IDriver>  => {
  const driver: IDriver | null = await Driver.findById(driverId);
  if (!driver) throw new Error("Driver not found");
  driver.isAvailable = !driver.isAvailable;
  await driver.save();
   return driver;
};

export const updateLocationRealtime = async (driverId: string,  latitude: number, longitude: number ): Promise<IDriver | null> => {

  // update driver's current position using GeoJSON

    const driver: IDriver | null = await Driver.findByIdAndUpdate(
    driverId,
    {
      location: {
        type: "Point",
        coordinates: [longitude, latitude], // GeoJSON format: [lng, lat]
      },
    },
    { new: true }
  );

  // save history snapshot (also in GeoJSON for consistency) and data qulity for future use 
  await Location.create({
    driver: new mongoose.Types.ObjectId(driverId),
    location: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
  } as ILocation);

  return driver;
};