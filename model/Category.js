import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    desc: { type: String },
    icon: { type: String, required: true },
    image: { type: String, required: true },
    featured: { type: Boolean, default: false },
    top_category: { type: Boolean, default: false },
    new_arrivable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite in Next.js hot reload
export default mongoose?.models?.Category ||
  mongoose.model("Category", CategorySchema);
