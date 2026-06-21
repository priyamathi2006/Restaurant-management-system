const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  assignDeliveryPartner,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/auth");

router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/", protect, authorize("Admin", "Chef", "Delivery", "Cashier"), getAllOrders);
router.get("/:id", protect, getOrderById);

// Staff updates order states
router.put("/:id/status", protect, authorize("Admin", "Chef", "Delivery", "Cashier"), updateOrderStatus);

// Delivery partners claim order for delivery
router.put("/:id/assign", protect, authorize("Delivery"), assignDeliveryPartner);

module.exports = router;
