const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forceReSeedDemo,
} = require("../controllers/authController");
const { protect } = require("../utils/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.post("/seed", protect, forceReSeedDemo);

module.exports = router;
