import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    customer: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: { type: String, required: true },
      country: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postal: { type: String, required: true },
      email: { type: String, required: true },
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        veriant: {},
        image: { type: String },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],

    // ✅ Coupon integration
    coupon: {
      code: { type: String },
      discountType: {
        type: String,
        enum: ["percentage", "fixed"],
      },
      discountValue: { type: Number },
      discountAmount: { type: Number, default: 0 },
      couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
      },
    },

    orderId: { type: String, require: true },

    subtotal: { type: Number, required: true },
    totalPrice: { type: Number, required: true },

    shippingMethod: {
      type: String,
      enum: ["free", "flat", "local"],
      default: "free",
    },

    paymentMethod: {
      type: String,
      enum: ["bank", "check", "cod"],
      default: "cod",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    deliveryStatus: {
      type: String,
      enum: ["pending", "shipped", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
