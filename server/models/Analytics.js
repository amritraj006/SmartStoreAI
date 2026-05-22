const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    cachedSuggestions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Analytics", AnalyticsSchema);
