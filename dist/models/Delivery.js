import mongoose, { Schema } from "mongoose";
const deliverySchema = new Schema({
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    driver: { type: Schema.Types.ObjectId, ref: "Driver", required: true },
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
}, { timestamps: true });
const Delivery = mongoose.model("Delivery", deliverySchema);
export default Delivery;
