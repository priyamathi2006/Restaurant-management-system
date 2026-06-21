import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  foods: [],
  selectedCategory: "All",
  searchQuery: "",
  loading: false,
  error: null,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    fetchMenuStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMenuSuccess: (state, action) => {
      state.loading = false;
      state.foods = action.payload;
    },
    fetchMenuFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    addFoodItem: (state, action) => {
      state.foods.push(action.payload);
    },
    updateFoodItem: (state, action) => {
      const index = state.foods.findIndex((food) => food._id === action.payload._id);
      if (index !== -1) {
        state.foods[index] = action.payload;
      }
    },
    deleteFoodItem: (state, action) => {
      state.foods = state.foods.filter((food) => food._id !== action.payload);
    },
  },
});

export const {
  fetchMenuStart,
  fetchMenuSuccess,
  fetchMenuFailed,
  setSelectedCategory,
  setSearchQuery,
  addFoodItem,
  updateFoodItem,
  deleteFoodItem,
} = menuSlice.actions;

export default menuSlice.reducer;
