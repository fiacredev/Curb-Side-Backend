import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
  },
  { timestamps: true }
);

export default mongoose.model('Customer', customerSchema);
