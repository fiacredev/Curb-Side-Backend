import mongoose, { Schema } from "mongoose";
const customerSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true }
}, { timestamps: true });
const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
