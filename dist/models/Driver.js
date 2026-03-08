import mongoose, { Schema } from "mongoose";
const driverSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: { type: String, required: true, unique: true },
    isAvailable: {
        type: Boolean,
        default: false,
    },
    // OLD format (optional)
    currentLocation: {
        lat: Number,
        lng: Number,
    },
    // NEW GeoJSON format
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
            validate: {
                validator: function (val) {
                    return val.length === 2;
                },
                message: "Coordinates must be [longitude, latitude]",
            },
        },
    },
}, { timestamps: true });
driverSchema.index({ location: "2dsphere" });
const Driver = mongoose.model("Driver", driverSchema);
export default Driver;
