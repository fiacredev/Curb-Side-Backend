import mongoose from "mongoose";
import dotenv from "dotenv";
import Customer from "./models/Customer.js";
import Driver from "./models/Driver.js";
import Delivery from "./models/Delivery.js";
import Location from "./models/Location.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    // 🔥 Clear old data
    await Customer.deleteMany();
    await Driver.deleteMany();
    await Delivery.deleteMany();
    await Location.deleteMany();

    console.log("Old data cleared");

    // 👤 Create Customers
    const customers = await Customer.insertMany([
      { name: "John Doe", email: "john@example.com" },
      { name: "Sarah Williams", email: "sarah@example.com" },
    ]);

    // 🚗 Create Drivers
    const drivers = await Driver.insertMany([
      {
        name: "David Smith",
        email: "david@driver.com",
        isAvailable: true,
        currentLocation: { lat: 40.7128, lng: -74.0060 },
      },
      {
        name: "Emily Johnson",
        email: "emily@driver.com",
        isAvailable: false,
        currentLocation: { lat: 34.0522, lng: -118.2437 },
      },
    ]);

    // 📦 Create Deliveries
    const deliveries = await Delivery.insertMany([
      {
        customer: customers[0]._id,
        driver: drivers[0]._id,
        pickup: { lat: 40.73061, lng: -73.935242 },
        dropoff: { lat: 40.650002, lng: -73.949997 },
        status: "pending",
      },
      {
        customer: customers[1]._id,
        driver: drivers[1]._id,
        pickup: { lat: 34.052235, lng: -118.243683 },
        dropoff: { lat: 34.040713, lng: -118.246769 },
        status: "in_progress",
      },
    ]);

    // 📍 Create Location History
    await Location.insertMany([
      {
        driver: drivers[0]._id,
        lat: 40.7150,
        lng: -74.0020,
      },
      {
        driver: drivers[0]._id,
        lat: 40.7200,
        lng: -74.0000,
      },
      {
        driver: drivers[1]._id,
        lat: 34.0500,
        lng: -118.2400,
      },
    ]);

    console.log("Database Seeded Successfully!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();
