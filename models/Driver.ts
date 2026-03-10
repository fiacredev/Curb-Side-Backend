import mongoose, { Document, Schema, Model } from "mongoose";

export interface IDriver extends Document {
  name: string;
  email: string;
  password:string;
  isAvailable: boolean;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  createdAt: Date;
  updatedAt: Date;
}

const driverSchema: Schema<IDriver> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    
    password:{type: String, required: true, unique: true},

    isAvailable: {
      type: Boolean,
      default: true,
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
          validator: function (val: number[]) {
            return val.length === 2;
          },
          message: "Coordinates must be [longitude, latitude]",
        },
      },
    },
  },
  { timestamps: true }
);

driverSchema.index({ location: "2dsphere" });

const Driver: Model<IDriver> = mongoose.model<IDriver>("Driver", driverSchema);

export default Driver;