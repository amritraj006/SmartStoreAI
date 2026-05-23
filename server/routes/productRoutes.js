const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  generateAIProductContent,
  searchProducts,
} = require("../controllers/productController");
const { protect } = require("../utils/authMiddleware");

const router = express.Router();

router.route("/")
  .get(protect, getProducts)
  .post(protect, createProduct);

router.route("/generate-ai")
  .post(protect, generateAIProductContent);

router.get("/search", protect, searchProducts);

router.route("/:id")
  .get(protect, getProductById)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
