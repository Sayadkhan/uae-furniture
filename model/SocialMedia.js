import mongoose, { Schema } from "mongoose";

const socialMediaSchema = new Schema(
  {
    platform: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    show: { type: Boolean, default: true },
    icon: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.SocialMedia ||
  mongoose.model("SocialMedia", socialMediaSchema);
