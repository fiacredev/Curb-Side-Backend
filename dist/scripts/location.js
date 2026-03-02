import mongoose from "mongoose";
import dotenv from "dotenv";
import Driver from "../models/Driver.js";
import Location from "../models/Location.js";
dotenv.config();
// Generate random location around LA
const generateRandomLocation = () => {
    const lat = 34.0522 + (Math.random() - 0.5) * 0.05;
    const lng = -118.2437 + (Math.random() - 0.5) * 0.05;
    return {
        type: "Point",
        coordinates: [lng, lat], // GeoJSON format
    };
};
const seedLocations = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        await mongoose.connect(mongoUri);
        console.log("✅ Connected to DB");
        await Location.deleteMany({});
        console.log("🗑️ Old locations removed");
        // Get only 5 different drivers
        const drivers = await Driver.find({}).limit(5);
        if (drivers.length < 5) {
            console.warn("⚠️ You need at least 5 drivers in DB.");
            return;
        }
        const locations = drivers.map((driver) => ({
            driver: driver._id, // different driverId
            location: generateRandomLocation(),
            timestamp: new Date(),
        }));
        await Location.insertMany(locations);
        console.log("📍 5 driver locations seeded successfully");
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Seeding error:", error.message);
        }
        else {
            console.error("Unknown error occurred");
        }
    }
    finally {
        await mongoose.disconnect();
        console.log("🔌 Disconnected from DB");
        process.exit(0);
    }
};
seedLocations();
