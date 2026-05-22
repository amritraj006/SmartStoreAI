import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { api } from "../services/api";
import {
  FaTag,
  FaAlignLeft,
  FaDollarSign,
  FaMagic,
  FaBoxes,
  FaSearch,
  FaBullhorn,
  FaSpinner,
  FaArrowLeft,
} from "react-icons/fa";

function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    seoTags: "",
    marketingCaptions: "",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAIGenerate = async () => {
    if (!formData.title) {
      setError("Product Title is required to generate AI content");
      return;
    }
    setError("");
    setIsGenerating(true);

    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        price: formData.price,
      };

      const response = await api.post("/products/generate-ai", payload);
      if (response.success && response.data) {
        setFormData((prev) => ({
          ...prev,
          description: response.data.description || prev.description,
          seoTags: response.data.seoTags ? response.data.seoTags.join(", ") : prev.seoTags,
          marketingCaptions: response.data.marketingCaptions || prev.marketingCaptions,
        }));
      }
    } catch (err) {
      console.error("AI Generation error:", err);
      setError("AI generation failed or timed out. Default templates were loaded.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Split seoTags by commas and clean spaces
      const tagsArray = formData.seoTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        seoTags: tagsArray,
      };

      const response = await api.post("/products", payload);
      if (response.success) {
        navigate("/products");
      }
    } catch (err) {
      console.error("Failed to add product:", err);
      setError(err.message || "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Navigation back */}
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 font-semibold text-sm transition cursor-pointer select-none"
        >
          <FaArrowLeft /> Back to Inventory
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
            <p className="text-gray-500 mt-1">Provide product details. AI can generate copywriting, tags, and marketing posts automatically.</p>
          </div>

          {error && (
            <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Product title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Title *
              </label>
              <div className="relative group">
                <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Wireless Headphones"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>
            </div>

            {/* Price and stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price ($) *
                </label>
                <div className="relative">
                  <FaDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <div className="relative">
                  <FaBoxes className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="100"
                    min="0"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
              >
                <option value="">Select category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="accessories">Accessories</option>
                <option value="general">General Goods</option>
              </select>
            </div>

            {/* AI Generator Helper Bar */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-2.5">
                <FaMagic className="text-blue-600 mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900 text-sm">Let AI write your copy</h4>
                  <p className="text-xs text-blue-700 mt-0.5">Generates description, SEO tags, and social captions instantly.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAIGenerate}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer select-none disabled:opacity-50 shrink-0 self-start sm:self-center"
              >
                {isGenerating ? (
                  <>
                    <FaSpinner className="animate-spin text-xs" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FaMagic />
                    Generate with AI
                  </>
                )}
              </button>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <div className="relative">
                <FaAlignLeft className="absolute left-4 top-4 text-gray-400" />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Describe your product manually, or click 'Generate with AI' to compose copy..."
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>
            </div>

            {/* SEO Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                SEO Search Tags (comma separated)
              </label>
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="seoTags"
                  value={formData.seoTags}
                  onChange={handleChange}
                  placeholder="e.g. bluetooth, earbuds, audio, wireless"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Marketing Caption */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Social Media Marketing Caption
              </label>
              <div className="relative">
                <FaBullhorn className="absolute left-4 top-4 text-gray-400" />
                <textarea
                  name="marketingCaptions"
                  value={formData.marketingCaptions}
                  onChange={handleChange}
                  rows="3"
                  placeholder="AI-generated post for instagram/twitter..."
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Form actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3 rounded-xl hover:shadow-lg transition-all font-semibold cursor-pointer text-sm disabled:opacity-50"
              >
                {isSubmitting ? "Adding Product..." : "Add Product"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors font-semibold cursor-pointer text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AddProduct;