import mongoose, { Document, Schema, Model } from "mongoose";

export interface ILocation extends Document {
  driver: mongoose.Types.ObjectId;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  timestamp: Date;
}

const locationSchema: Schema<ILocation> = new Schema({
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


const Location: Model<ILocation> = mongoose.model<ILocation>("Location", locationSchema);

export default Location;