// import mongoose from "mongoose";
// import Location, {ILocation} from "../models/Location.js";
// import Driver from "../models/Driver.js";

// // Sample seed data: array of driver location objects
// const seedDriverLocations = [
//   { driverId: "64f0c8f1a5e1b2c3d4e5f678", lat: 40.73061, lng: -73.935242 },
//   { driverId: "64f0c8f1a5e1b2c3d4e5f679", lat: 34.052235, lng: -118.243683 },
//   { driverId: "64f0c8f1a5e1b2c3d4e5f680", lat: 51.509865, lng: -0.118092 },
// ];

// async function seedLocations() {
//   try {
//     await mongoose.connect("mongodb://localhost:27017/your-db-name"); // replace with your DB

//     console.log("Connected to MongoDB");

//     for (const entry of seedDriverLocations) {
//       const driverExists = await Driver.findById(entry.driverId);
//       if (!driverExists) {
//         console.warn(`Driver not found: ${entry.driverId}, skipping...`);
//         continue;
//       }

//       const location: ILocation = new Location({
//         driver: entry.driverId,
//         location: {
//           type: "Point",
//           coordinates: [entry.lng, entry.lat], // [lng, lat] for GeoJSON
//         },
//         timestamp: new Date(),
//       });

//       await location.save();
//       console.log(`Location saved for driver ${entry.driverId}`);
//     }

//     console.log("Seeding completed");
//     process.exit(0);
//   } catch (err) {
//     console.error("Seeding error:", err);
//     process.exit(1);
//   }
// }

// seedLocations();