import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    shortDesc: { type: String },
    desc: { type: String },

    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },

    featured: { type: Boolean, default: false },
    topsell: { type: Boolean, default: false },

    newarrivable: { type: Boolean, default: true },

    discount: { type: Number, default: 0 },
    discountType: {
      type: String,
      enum: ["percentage", "flat"],
      default: "percentage",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },

    childcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChildCategory",
    },

    tags: [{ type: String }],

    images: [{ type: String }],

    variants: [
      {
        attributes: {
          color: { type: String },
          hexCode: { type: String },
          size: { type: String },
          material: { type: String },
        },
        images: [{ type: String }],
        stock: { type: Number, default: 0 },
        price: { type: Number },
      },
    ],

    // ✅ Only review IDs stored here
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    // Optional aggregate fields
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
