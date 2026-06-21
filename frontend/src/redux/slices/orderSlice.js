import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  activeOrder: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    orderActionStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    orderActionSuccess: (state) => {
      state.loading = false;
    },
    orderActionFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setActiveOrder: (state, action) => {
      state.activeOrder = action.payload;
    },
    updateActiveOrderState: (state, action) => {
      // Used for real-time WebSocket updates to the active order
      if (state.activeOrder && state.activeOrder._id === action.payload._id) {
        state.activeOrder = action.payload;
      }
      // Also update in list if present
      const index = state.orders.findIndex((o) => o._id === action.payload._id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
    addNewOrderToList: (state, action) => {
      // Add new order at the top of list
      const index = state.orders.findIndex((o) => o._id === action.payload._id);
      if (index === -1) {
        state.orders.unshift(action.payload);
      }
    },
  },
});

export const {
  orderActionStart,
  orderActionSuccess,
  orderActionFailed,
  setOrders,
  setActiveOrder,
  updateActiveOrderState,
  addNewOrderToList,
} = orderSlice.actions;

export default orderSlice.reducer;
