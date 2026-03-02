import Location from "../models/Location.js";
import Driver from "../models/Driver.js";
import Delivery from "../models/Delivery.js";
import mongoose from "mongoose";
export const updateLocation = async (driverId, lat, lng) => {
    console.log("received driver id is: ", driverId);
    // type mongooose query result
    const driver = await Driver.findById(driverId);
    if (!driver)
        throw new Error("Driver not found");
    // dela with printing all drivers
    const drivers = await Driver.find();
    console.log("drivers received: ", drivers);
    const activeDelivery = await Delivery.findOne({
        driver: driver._id,
        status: "in_progress"
    });
    if (driver.isAvailable || activeDelivery) {
        driver.location = { type: "Point", coordinates: [lng, lat] };
        await driver.save();
        await Location.create({ driver: driver._id,
            location: {
                type: "Point",
                coordinates: [lng, lat], // GeoJSON expects [longitude, latitude]
            },
        });
        return driver;
    }
    else {
        console.log("Tracking skipped");
        return driver;
    }
};
export const toggleAvailability = async (driverId) => {
    const driver = await Driver.findById(driverId);
    if (!driver)
        throw new Error("Driver not found");
    driver.isAvailable = !driver.isAvailable;
    await driver.save();
    return driver;
};
export const updateLocationRealtime = async (driverId, latitude, longitude) => {
    const driver = await Driver.findByIdAndUpdate(driverId, { location: { type: "Point", coordinates: [longitude, latitude] } }, { new: true });
    try {
        await Location.create({
            driver: new mongoose.Types.ObjectId(driverId),
            location: { type: "Point", coordinates: [longitude, latitude] },
        });
        console.log("Location document saved");
    }
    catch (err) {
        console.error("Failed to save Location document:", err);
    }
    return driver;
};
