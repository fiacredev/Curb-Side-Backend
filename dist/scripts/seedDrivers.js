import mongoose from "mongoose";
import dotenv from "dotenv";
import Driver from "../models/Driver.js";
dotenv.config();
const BASE_LAT = -1.9305352087538072;
const BASE_LNG = 30.15298435188576;
// Generate random nearby location (~1–2km radius)
const generateNearbyLocation = () => {
    const latOffset = (Math.random() - 0.5) * 0.02;
    const lngOffset = (Math.random() - 0.5) * 0.02;
    const lat = BASE_LAT + latOffset;
    const lng = BASE_LNG + lngOffset;
    return {
        currentLocation: { lat, lng },
        location: {
            type: "Point",
            coordinates: [lng, lat], // [longitude, latitude]
        },
    };
};
const seedDrivers = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        await mongoose.connect(mongoUri);
        console.log("✅ Connected to DB");
        await Driver.deleteMany({});
        console.log("🗑️ Old drivers removed");
        const drivers = Array.from({ length: 10 }).map((_, i) => {
            const locationData = generateNearbyLocation();
            return {
                name: `Driver ${i + 1}`,
                email: `driver${i + 1}@test.com`,
                isAvailable: true,
                ...locationData,
            };
        });
        await Driver.insertMany(drivers);
        console.log("🚗 10 drivers seeded successfully near given coordinates");
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
seedDrivers();
