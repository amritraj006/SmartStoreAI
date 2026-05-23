const Product = require("../models/Product");
const Order = require("../models/Order");

// @desc    Get live notifications based on actual DB state
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = [];

    // 1. Out of stock alerts (critical)
    const outOfStock = await Product.find({ user: userId, stock: 0 });
    outOfStock.forEach((p) => {
      notifications.push({
        id: `oos-${p._id}`,
        type: "critical",
        title: "Out of Stock",
        message: `"${p.title}" has run out of stock. Customers cannot purchase.`,
        time: new Date(p.updatedAt).toISOString(),
        icon: "alert",
        read: false,
      });
    });

    // 2. Low stock warnings
    const lowStock = await Product.find({ user: userId, stock: { $gt: 0, $lte: 10 } });
    lowStock.forEach((p) => {
      notifications.push({
        id: `low-${p._id}`,
        type: "warning",
        title: "Low Stock Warning",
        message: `"${p.title}" only has ${p.stock} unit${p.stock === 1 ? "" : "s"} remaining.`,
        time: new Date(p.updatedAt).toISOString(),
        icon: "warning",
        read: false,
      });
    });

    // 3. Recent orders (last 24h)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentOrders = await Order.find({
      user: userId,
      createdAt: { $gte: oneDayAgo },
    })
      .populate("product")
      .sort({ createdAt: -1 })
      .limit(3);

    recentOrders.forEach((order) => {
      notifications.push({
        id: `order-${order._id}`,
        type: "success",
        title: "New Order",
        message: `${order.quantity} unit${order.quantity === 1 ? "" : "s"} of "${
          order.product?.title || "a product"
        }" ordered. Revenue: $${order.totalPrice.toFixed(2)}.`,
        time: new Date(order.createdAt).toISOString(),
        icon: "order",
        read: false,
      });
    });

    // 4. General system notification if store is clean
    if (notifications.length === 0) {
      notifications.push({
        id: "system-ok",
        type: "info",
        title: "All Systems Operational",
        message: "Your store is running smoothly. All products are in stock.",
        time: new Date().toISOString(),
        icon: "info",
        read: true,
      });
    }

    // Sort: unread first, then by time desc
    notifications.sort((a, b) => {
      if (a.read !== b.read) return a.read ? 1 : -1;
      return new Date(b.time) - new Date(a.time);
    });

    const unreadCount = notifications.filter((n) => !n.read).length;

    return res.json({
      success: true,
      notifications: notifications.slice(0, 8),
      unreadCount,
    });
  } catch (error) {
    console.error("Notifications Error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching notifications" });
  }
};

module.exports = { getNotifications };
