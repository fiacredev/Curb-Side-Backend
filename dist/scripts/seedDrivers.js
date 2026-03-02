import mongoose from "mongoose";
import dotenv from "dotenv";
import Driver from "../models/Driver.js";
dotenv.config();
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
        const drivers = [
            {
                name: "Emily Johnson",
                email: "emily@driver.com",
                isAvailable: true,
                location: {
                    type: "Point",
                    coordinates: [-118.2437, 34.0522],
                },
            },
            {
                name: "Michael Smith",
                email: "michael@driver.com",
                isAvailable: true,
                location: {
                    type: "Point",
                    coordinates: [-118.25, 34.05],
                },
            },
            {
                name: "Sophia Williams",
                email: "sophia@driver.com",
                isAvailable: true,
                location: {
                    type: "Point",
                    coordinates: [-118.24, 34.048],
                },
            },
            {
                name: "Daniel Brown",
                email: "daniel@driver.com",
                isAvailable: true,
                location: {
                    type: "Point",
                    coordinates: [-118.255, 34.0535],
                },
            },
            {
                name: "Olivia Davis",
                email: "olivia@driver.com",
                isAvailable: true,
                location: {
                    type: "Point",
                    coordinates: [-118.238, 34.055],
                },
            },
        ];
        await Driver.insertMany(drivers);
        console.log("5 drivers seeded successfully");
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
