// store/adminSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null,
};

console.log(initialState);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.admin = action.payload;
    },
    clearAdmin: (state) => {
      state.admin = null;
    },
    updateAdminField: (state, action) => {
      if (state.admin) state.admin[action.payload.field] = action.payload.value;
    },
  },
});

export const { setAdmin, clearAdmin, updateAdminField } = adminSlice.actions;
export default adminSlice.reducer;
