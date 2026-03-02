import mongoose, { Schema } from "mongoose";
const locationSchema = new Schema({
    driver: {
        type: Schema.Types.ObjectId,
        ref: "Driver",
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
            required: true,
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
});
locationSchema.index({ location: "2dsphere" });
const Location = mongoose.model("Location", locationSchema);
export default Location;
