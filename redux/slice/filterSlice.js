import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categoryIds: [],
  subCategoryIds: [],
  childCategoryIds: [],
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    toggleCategory: (state, action) => {
      const id = action.payload;
      if (state.categoryIds.includes(id)) {
        state.categoryIds = state.categoryIds.filter((c) => c !== id);
      } else {
        state.categoryIds.push(id);
      }
    },
    toggleSubCategory: (state, action) => {
      const id = action.payload;
      if (state.subCategoryIds.includes(id)) {
        state.subCategoryIds = state.subCategoryIds.filter((s) => s !== id);
      } else {
        state.subCategoryIds.push(id);
      }
    },
    toggleChildCategory: (state, action) => {
      const id = action.payload;
      if (state.childCategoryIds.includes(id)) {
        state.childCategoryIds = state.childCategoryIds.filter(
          (ch) => ch !== id
        );
      } else {
        state.childCategoryIds.push(id);
      }
    },
    clearFilters: (state) => {
      state.categoryIds = [];
      state.subCategoryIds = [];
      state.childCategoryIds = [];
    },
  },
});

export const {
  toggleCategory,
  toggleSubCategory,
  toggleChildCategory,
  clearFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
