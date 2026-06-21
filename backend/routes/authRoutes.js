const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  getAllUsers,
  updateUserRole,
} = require("../controllers/authController");
const { protect, authorize } = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Admin only routes
router.get("/users", protect, authorize("Admin"), getAllUsers);
router.put("/users/:id/role", protect, authorize("Admin"), updateUserRole);

module.exports = router;
