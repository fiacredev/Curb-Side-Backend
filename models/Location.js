import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  lat: Number,
  lng: Number,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Location', locationSchema);
