const Product = require("../models/Product");
const Order = require("../models/Order");
const aiService = require("../services/aiService");

// @desc    Get all products for logged-in user
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json({ success: true, products });
  } catch (error) {
    console.error("Get Products Error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching products" });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, user: req.user._id });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.json({ success: true, product });
  } catch (error) {
    console.error("Get Product Error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching product details" });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
  const { title, description, price, category, stock, seoTags, marketingCaptions, image } = req.body;

  try {
    const product = await Product.create({
      user: req.user._id,
      title,
      description,
      price: Number(price),
      category: category || "Uncategorized",
      stock: Number(stock),
      seoTags: seoTags || [],
      marketingCaptions: marketingCaptions || "",
      image: image || "",
    });

    return res.status(201).json({ success: true, product });
  } catch (error) {
    console.error("Create Product Error:", error);
    return res.status(500).json({ success: false, message: "Server error creating product" });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
  const { title, description, price, category, stock, seoTags, marketingCaptions, image } = req.body;

  try {
    let product = await Product.findOne({ _id: req.params.id, user: req.user._id });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found or unauthorized" });
    }

    product.title = title !== undefined ? title : product.title;
    product.description = description !== undefined ? description : product.description;
    product.price = price !== undefined ? Number(price) : product.price;
    product.category = category !== undefined ? category : product.category;
    product.stock = stock !== undefined ? Number(stock) : product.stock;
    product.seoTags = seoTags !== undefined ? seoTags : product.seoTags;
    product.marketingCaptions = marketingCaptions !== undefined ? marketingCaptions : product.marketingCaptions;
    product.image = image !== undefined ? image : product.image;

    const updatedProduct = await product.save();
    return res.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Update Product Error:", error);
    return res.status(500).json({ success: false, message: "Server error updating product" });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, user: req.user._id });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found or unauthorized" });
    }

    // Delete associated orders to keep db clean
    await Order.deleteMany({ product: product._id });
    
    // Delete product
    await Product.deleteOne({ _id: product._id });

    return res.json({ success: true, message: "Product and associated orders removed" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    return res.status(500).json({ success: false, message: "Server error deleting product" });
  }
};

// @desc    Generate product content with AI
// @route   POST /api/products/generate-ai
// @access  Private
const generateAIProductContent = async (req, res) => {
  const { title, category, price } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: "Title is required for AI generation" });
  }

  try {
    const generated = await aiService.generateContent({ title, category, price });
    return res.json({ success: true, data: generated });
  } catch (error) {
    console.error("AI Generation Controller Error:", error);
    return res.status(500).json({ success: false, message: "Failed to generate AI content" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  generateAIProductContent,
};
