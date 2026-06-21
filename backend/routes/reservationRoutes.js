const express = require("express");
const router = express.Router();
const {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservationStatus,
} = require("../controllers/reservationController");
const { protect, authorize } = require("../middleware/auth");

router.post("/", protect, createReservation);
router.get("/myreservations", protect, getMyReservations);

// Admin / Cashier only routes
router.get("/", protect, authorize("Admin", "Cashier"), getAllReservations);
router.put("/:id/status", protect, authorize("Admin", "Cashier"), updateReservationStatus);

module.exports = router;
