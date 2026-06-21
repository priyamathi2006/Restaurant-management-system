import { createSlice } from "@reduxjs/toolkit";

const calculateTotals = (items, couponCode) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = Math.round(subtotal * 0.05 * 100) / 100;
  
  // Free delivery over 500
  const deliveryCharge = subtotal > 0 && subtotal < 500 ? 40 : 0;
  
  let discount = 0;
  if (couponCode === "WELCOME10") {
    discount = Math.round(subtotal * 0.1 * 100) / 100;
  } else if (couponCode === "FREE20") {
    discount = Math.round(subtotal * 0.2 * 100) / 100;
  }
  
  const total = Math.max(0, subtotal + gst + deliveryCharge - discount);
  return { subtotal, gst, deliveryCharge, discount, total };
};

const initialState = {
  items: [],
  couponCode: "",
  subtotal: 0,
  gst: 0,
  deliveryCharge: 0,
  discount: 0,
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { _id, name, price, image } = action.payload;
      const existingItem = state.items.find((item) => item.foodId === _id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          foodId: _id,
          name,
          price,
          image,
          quantity: 1,
        });
      }
      
      // Recalculate totals
      const totals = calculateTotals(state.items, state.couponCode);
      Object.assign(state, totals);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.foodId !== action.payload);
      
      const totals = calculateTotals(state.items, state.couponCode);
      Object.assign(state, totals);
    },
    updateQuantity: (state, action) => {
      const { foodId, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.foodId === foodId);
      
      if (existingItem && quantity > 0) {
        existingItem.quantity = quantity;
      }
      
      const totals = calculateTotals(state.items, state.couponCode);
      Object.assign(state, totals);
    },
    applyCoupon: (state, action) => {
      state.couponCode = action.payload;
      const totals = calculateTotals(state.items, state.couponCode);
      Object.assign(state, totals);
    },
    removeCoupon: (state) => {
      state.couponCode = "";
      const totals = calculateTotals(state.items, state.couponCode);
      Object.assign(state, totals);
    },
    clearCart: (state) => {
      state.items = [];
      state.couponCode = "";
      state.subtotal = 0;
      state.gst = 0;
      state.deliveryCharge = 0;
      state.discount = 0;
      state.total = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  removeCoupon,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
