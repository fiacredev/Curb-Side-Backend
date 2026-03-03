import mongoose, { Document, Schema, Model } from "mongoose";

export interface IDelivery extends Document {
  customer: mongoose.Types.ObjectId;
  driver: mongoose.Types.ObjectId;
  pickup: {
    lat: number;
    lng: number;
  };
  dropoff: {
    lat: number;
    lng: number;
  };
  status: "pending" | "accepted" | "in_progress" | "completed";
  createdAt: Date;
  updatedAt: Date;
}


const deliverySchema: Schema<IDelivery> = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: false, default:null },
    driver: { type: Schema.Types.ObjectId, ref: "Driver", required: false  , default:null },
    pickup: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    dropoff: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "in_progress", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Delivery: Model<IDelivery> = mongoose.model<IDelivery>("Delivery", deliverySchema);
export default Delivery;