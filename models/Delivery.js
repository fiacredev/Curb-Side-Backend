import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    pickup: { lat: Number, lng: Number },
    dropoff: { lat: Number, lng: Number },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'in_progress', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Delivery', deliverySchema);
