import mongoose, { Document, Schema, Model } from "mongoose";

export interface IDelivery extends Document {
  customer: mongoose.Types.ObjectId | null;
  driver: mongoose.Types.ObjectId | null;

  customerEmail: string | null;
  driverEmail: string | null;

  pickupLocation: {
    type: "Point";
    coordinates: number[]; // [lng, lat]
  };

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
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },

    driver: {
      type: Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },

    customerEmail: { type: String, default: null },
    driverEmail: { type: String, default: null },

    pickupLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default:"Point"
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },

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


// before model is created we need this 

deliverySchema.pre("save", function (next) {
  if (this.pickup) {
    this.pickupLocation = {
      type: "Point",
      coordinates: [this.pickup.lng, this.pickup.lat],
    };
  }
});


// geo index
deliverySchema.index({ pickupLocation: "2dsphere" });

const Delivery: Model<IDelivery> = mongoose.model<IDelivery>(
  "Delivery",
  deliverySchema
);

export default Delivery;