import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    isAvailable: { type: Boolean, default: false },
    currentLocation: {
      lat: Number,
      lng: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Driver', driverSchema);
