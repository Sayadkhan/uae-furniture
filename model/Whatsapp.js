import mongoose from "mongoose";

const WhatsappSchema = new mongoose.Schema(
  {
    number: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Whatsapp ||
  mongoose.model("Whatsapp", WhatsappSchema);
