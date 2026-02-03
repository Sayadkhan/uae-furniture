"use client";

import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// ✅ Load from localStorage if available
const loadCartFromStorage = () => {
  try {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error loading cart from storage:", error);
    return null;
  }
};

const saveCartToStorage = (state) => {
  try {
    localStorage.setItem("cart", JSON.stringify(state));
  } catch (error) {
    console.error("Error saving cart to storage:", error);
  }
};

const initialState =
  typeof window !== "undefined" && loadCartFromStorage()
    ? loadCartFromStorage()
    : {
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
      };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { productId, name, price, quantity, variant, image, userId } =
        action.payload;

      const existingItem = state.items.find(
        (item) =>
          item.productId === productId &&
          (variant?._id ? item.variant?._id === variant._id : !item.variant) &&
          item.userId === action.payload.userId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          userId,
          productId,
          name,
          price,
          quantity,
          variant: variant || null,
          image,
        });
      }

      // ✅ recalc totals
      state.totalQuantity = state.items.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
      state.totalPrice = state.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      saveCartToStorage(state);
      // toast.success(
      //   `✅ Added ${quantity} x ${variant?.name ? variant.name : name} to cart`
      // );
    },

    removeFromCart: (state, action) => {
      const { productId, variantId } = action.payload;

      state.items = state.items.filter(
        (item) =>
          !(
            item.productId === productId &&
            (variantId ? item.variant?._id === variantId : !item.variant)
          )
      );

      // ✅ recalc totals
      state.totalQuantity = state.items.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
      state.totalPrice = state.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      saveCartToStorage(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      saveCartToStorage(state);
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
