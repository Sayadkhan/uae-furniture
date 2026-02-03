import mongoose from "mongoose";

const ChildCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },
  },
  { timestamps: true }
);

export default mongoose.models.ChildCategory ||
  mongoose.model("ChildCategory", ChildCategorySchema);
