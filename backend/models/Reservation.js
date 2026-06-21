const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
    },
    customerEmail: {
      type: String,
      required: [true, "Customer email is required"],
    },
    customerPhone: {
      type: String,
      required: [true, "Customer phone number is required"],
    },
    reservationDate: {
      type: Date,
      required: [true, "Reservation date & time are required"],
    },
    guests: {
      type: Number,
      required: [true, "Number of guests is required"],
      min: 1,
    },
    tableNumber: {
      type: Number,
      required: [true, "Table number is required"],
    },
    specialRequests: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Reservation", reservationSchema);
