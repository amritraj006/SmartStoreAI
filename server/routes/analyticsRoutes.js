const express = require("express");
const { getDashboardStats, getAISuggestions } = require("../controllers/analyticsController");
const { protect } = require("../utils/authMiddleware");

const router = express.Router();

router.get("/dashboard", protect, getDashboardStats);
router.get("/suggestions", protect, getAISuggestions);

module.exports = router;
