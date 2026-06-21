const express = require("express");
const router = express.Router();
const {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  addFoodReview,
} = require("../controllers/foodController");
const { protect, authorize } = require("../middleware/auth");

router.get("/", getFoods);
router.get("/:id", getFoodById);

// Admin-only food actions
router.post("/", protect, authorize("Admin"), createFood);
router.put("/:id", protect, authorize("Admin"), updateFood);
router.delete("/:id", protect, authorize("Admin"), deleteFood);

// Customer-only review posting
router.post("/:id/reviews", protect, authorize("Customer"), addFoodReview);

module.exports = router;
