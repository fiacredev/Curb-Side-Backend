import mongoose, { Document, Schema, Model } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema: Schema<ICustomer> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Customer: Model<ICustomer> = mongoose.model<ICustomer>("Customer", customerSchema);
export default Customer;