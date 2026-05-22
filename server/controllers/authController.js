const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "your_super_secret_key", {
    expiresIn: "30d",
  });
};

/**
 * Helper to seed initial demo data for a new user
 * So they are greeted with a beautiful dashboard with data immediately
 */
const seedDemoData = async (userId) => {
  // 1. Seed Products
  const productsData = [
    {
      user: userId,
      title: "Smart Watch",
      price: 299,
      stock: 45,
      category: "accessories",
      description: "Premium fitness smartwatch featuring continuous heart rate, sleep tracking, smart notifications, and up to 7 days battery life. Water resistant design with high-res customizable face.",
      seoTags: ["smart watch", "fitness tracker", "wearables", "accessories"],
      marketingCaptions: "⏱️ Elevate your lifestyle with the all-new Smart Watch! Track your fitness, stay connected, and style up your wrist. Get yours today! 🌟 #WearableTech #FitnessGoals",
    },
    {
      user: userId,
      title: "Wireless Earbuds",
      price: 159,
      stock: 120,
      category: "electronics",
      description: "Active Noise Cancelling (ANC) true wireless earbuds with deep bass, spatial audio, dual beamforming microphones, and sweat resistance. Includes charging case yielding 30h total playback.",
      seoTags: ["earbuds", "wireless audio", "noise cancelling", "headphones", "electronics"],
      marketingCaptions: "🎵 Immersive sound, zero distractions. Experience ultimate freedom with ANC Wireless Earbuds. Click to shop now! 🎧🔥 #AudioFreedom #ANC",
    },
    {
      user: userId,
      title: "Gaming Mouse",
      price: 89,
      stock: 8, // Low stock for inventory alerts demonstration!
      category: "electronics",
      description: "High-precision ergonomic optical gaming mouse featuring ultra-fast response, 16,000 DPI sensor, customizable RGB illumination, and 8 programmable buttons.",
      seoTags: ["gaming mouse", "pc gaming", "rgb accessories", "electronics"],
      marketingCaptions: "🖱️ Level up your gameplay! Pinpoint accuracy and custom RGB settings with our flagship Gaming Mouse. Special price of $89 for a limited time! 🎮🚀 #PCGaming #GamerGear",
    },
    {
      user: userId,
      title: "Mechanical Keyboard",
      price: 149,
      stock: 0, // Out of stock for demonstration!
      category: "electronics",
      description: "Tactile hot-swappable mechanical keyboard with RGB backlighting, custom brown switches, aluminum framing, and dual wired/wireless Bluetooth connection modes.",
      seoTags: ["mechanical keyboard", "keyboard", "hot swap", "electronics", "office gear"],
      marketingCaptions: "⌨️ That tactile typing feel you've been searching for. Custom switches and aluminum build. Get yours today! 💻✨ #Keyboards #Productivity",
    },
  ];

  const seededProducts = await Product.insertMany(productsData);

  // Map by name for order reference
  const productMap = {};
  seededProducts.forEach((p) => {
    productMap[p.title] = p;
  });

  // 2. Seed Orders (sales history spread over the past 6 months)
  const currentDate = new Date();
  const ordersData = [];

  // Helper to get date N months ago
  const getDateMonthsAgo = (monthsAgo) => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - monthsAgo);
    // Randomize day
    d.setDate(Math.floor(Math.random() * 28) + 1);
    return d;
  };

  // Sales distributions across months
  // Month 5 ago (e.g. Dec/Jan)
  const salesMap = [
    { monthsAgo: 5, sales: [ { prod: "Smart Watch", qty: 4 }, { prod: "Wireless Earbuds", qty: 6 }, { prod: "Gaming Mouse", qty: 8 } ] },
    { monthsAgo: 4, sales: [ { prod: "Smart Watch", qty: 7 }, { prod: "Wireless Earbuds", qty: 9 }, { prod: "Gaming Mouse", qty: 12 } ] },
    { monthsAgo: 3, sales: [ { prod: "Smart Watch", qty: 5 }, { prod: "Wireless Earbuds", qty: 11 }, { prod: "Gaming Mouse", qty: 9 }, { prod: "Mechanical Keyboard", qty: 3 } ] },
    { monthsAgo: 2, sales: [ { prod: "Smart Watch", qty: 12 }, { prod: "Wireless Earbuds", qty: 15 }, { prod: "Gaming Mouse", qty: 18 }, { prod: "Mechanical Keyboard", qty: 5 } ] },
    { monthsAgo: 1, sales: [ { prod: "Smart Watch", qty: 18 }, { prod: "Wireless Earbuds", qty: 22 }, { prod: "Gaming Mouse", qty: 24 }, { prod: "Mechanical Keyboard", qty: 8 } ] },
    { monthsAgo: 0, sales: [ { prod: "Smart Watch", qty: 24 }, { prod: "Wireless Earbuds", qty: 30 }, { prod: "Gaming Mouse", qty: 15 }, { prod: "Mechanical Keyboard", qty: 12 } ] }
  ];

  salesMap.forEach(({ monthsAgo, sales }) => {
    sales.forEach(({ prod, qty }) => {
      const product = productMap[prod];
      if (product) {
        ordersData.push({
          user: userId,
          product: product._id,
          quantity: qty,
          totalPrice: product.price * qty,
          status: "Completed",
          createdAt: getDateMonthsAgo(monthsAgo)
        });
      }
    });
  });

  await Order.insertMany(ordersData);
  console.log("Demo data successfully seeded for user:", userId);
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, storeName } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      storeName: storeName || "My Smart Store",
    });

    if (user) {
      // Seed Demo Data automatically
      await seedDemoData(user._id);

      return res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        storeName: user.storeName,
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Register Error:", error.message);
    console.error("Error Stack:", error.stack);
    return res.status(500).json({ success: false, message: error.message || "Server error during registration" });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      return res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        storeName: user.storeName,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Server error during login" });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      return res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        storeName: user.storeName,
      });
    } else {
      return res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({ success: false, message: "Server error retrieving profile" });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.storeName = req.body.storeName || user.storeName;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      return res.json({
        success: true,
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        storeName: updatedUser.storeName,
        token: generateToken(updatedUser._id),
      });
    } else {
      return res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ success: false, message: "Server error updating profile" });
  }
};

// @desc    Reset and re-seed demo data
// @route   POST /api/auth/seed
// @access  Private
const forceReSeedDemo = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete existing products and orders for this user
    await Product.deleteMany({ user: userId });
    await Order.deleteMany({ user: userId });

    // Seed new demo data
    await seedDemoData(userId);

    return res.json({ success: true, message: "Demo data successfully re-seeded!" });
  } catch (error) {
    console.error("Force Re-seed Error:", error);
    return res.status(500).json({ success: false, message: "Server error during seeding" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forceReSeedDemo,
};
