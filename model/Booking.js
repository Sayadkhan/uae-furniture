import mongoose, { Schema } from "mongoose";

const BookingSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: String, required: true },
    done: { type: Boolean, default: false },
    phone: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);
