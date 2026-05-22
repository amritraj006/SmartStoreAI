const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  generateAIProductContent,
} = require("../controllers/productController");
const { protect } = require("../utils/authMiddleware");

const router = express.Router();

router.route("/")
  .get(protect, getProducts)
  .post(protect, createProduct);

router.route("/generate-ai")
  .post(protect, generateAIProductContent);

router.route("/:id")
  .get(protect, getProductById)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
