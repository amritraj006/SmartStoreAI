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
  FaCheckCircle,
  FaRobot,
} from "react-icons/fa";

const AI_STEPS = [
  "Analyzing product details...",
  "Writing product description...",
  "Generating SEO tags...",
  "Crafting marketing caption...",
  "Finalizing content...",
];

// Simple toast component
function Toast({ message, type, onClose }) {
  return (
    <div className={`animate-toast-in toast toast-${type} shadow-xl`}>
      <FaCheckCircle className="shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-semibold text-sm">{message}</p>
      </div>
      <button onClick={onClose} className="opacity-70 hover:opacity-100">✕</button>
    </div>
  );
}

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
  const [aiStep, setAiStep] = useState(0);
  const [aiProgress, setAiProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [aiGeneratedFields, setAiGeneratedFields] = useState(new Set());
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear AI badge if user manually edits
    if (aiGeneratedFields.has(e.target.name)) {
      setAiGeneratedFields((prev) => {
        const next = new Set(prev);
        next.delete(e.target.name);
        return next;
      });
    }
  };

  const handleAIGenerate = async () => {
    if (!formData.title) {
      setError("Product Title is required to generate AI content");
      return;
    }
    setError("");
    setIsGenerating(true);
    setAiStep(0);
    setAiProgress(0);

    // Animate steps
    const stepInterval = setInterval(() => {
      setAiStep((prev) => {
        const next = prev + 1;
        setAiProgress(Math.round((next / AI_STEPS.length) * 100));
        if (next >= AI_STEPS.length - 1) clearInterval(stepInterval);
        return next;
      });
    }, 400);

    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        price: formData.price,
      };
      const response = await api.post("/products/generate-ai", payload);
      if (response.success && response.data) {
        clearInterval(stepInterval);
        setAiProgress(100);
        setFormData((prev) => ({
          ...prev,
          description: response.data.description || prev.description,
          seoTags: response.data.seoTags ? response.data.seoTags.join(", ") : prev.seoTags,
          marketingCaptions: response.data.marketingCaptions || prev.marketingCaptions,
        }));
        setAiGeneratedFields(new Set(["description", "seoTags", "marketingCaptions"]));
        showToast("AI content generated successfully! ✨");
      }
    } catch (err) {
      clearInterval(stepInterval);
      setError("AI generation failed. Please try again.");
      showToast("AI generation failed.", "error");
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setAiStep(0);
        setAiProgress(0);
      }, 600);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
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
        showToast("Product added successfully! 🎉");
        setTimeout(() => navigate("/products"), 800);
      }
    } catch (err) {
      setError(err.message || "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const AiBadge = ({ field }) =>
    aiGeneratedFields.has(field) ? (
      <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-violet-600 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full">
        <FaRobot className="text-[8px]" /> AI Generated
      </span>
    ) : null;

  return (
    <DashboardLayout>
      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 font-semibold text-sm transition cursor-pointer select-none"
        >
          <FaArrowLeft /> Back to Inventory
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow shadow-indigo-200">
                <FaTag className="text-white text-sm" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-800">Add New Product</h1>
                <p className="text-slate-400 text-sm mt-0.5">
                  Fill in details below. Use AI to auto-generate copywriting instantly.
                </p>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mx-6 mt-5 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm flex items-center gap-2">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Product Title *</label>
              <div className="relative group">
                <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Wireless Noise-Cancelling Headphones"
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 text-sm transition-all"
                  required
                />
              </div>
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Price ($) *</label>
                <div className="relative">
                  <FaDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 text-sm transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Stock Quantity *</label>
                <div className="relative">
                  <FaBoxes className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="100"
                    min="0"
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 text-sm transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white text-sm transition-all"
              >
                <option value="">Select category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="accessories">Accessories</option>
                <option value="general">General Goods</option>
              </select>
            </div>

            {/* AI Generator Panel */}
            <div className="bg-gradient-to-r from-indigo-50 via-violet-50 to-indigo-50 border border-indigo-200/60 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow shadow-indigo-300/40 shrink-0">
                    <FaMagic className="text-white text-sm" />
                  </div>
                  <div>
                    <h4 className="font-bold text-indigo-900 text-sm">AI Content Generator</h4>
                    <p className="text-xs text-indigo-600 mt-0.5">
                      Auto-writes description, SEO tags & social captions in seconds.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAIGenerate}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-indigo-200 disabled:opacity-60 shrink-0 cursor-pointer select-none btn-ai-glow"
                >
                  {isGenerating ? (
                    <><FaSpinner className="animate-spin text-xs" /> Generating...</>
                  ) : (
                    <><FaMagic className="text-xs" /> Generate with AI</>
                  )}
                </button>
              </div>

              {/* Progress bar */}
              {isGenerating && (
                <div className="mt-4 animate-fade-in-up">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-semibold text-indigo-700">{AI_STEPS[aiStep]}</p>
                    <p className="text-xs font-bold text-indigo-600">{aiProgress}%</p>
                  </div>
                  <div className="w-full h-2 bg-indigo-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                      style={{ width: `${aiProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Description * <AiBadge field="description" />
              </label>
              <div className="relative">
                <FaAlignLeft className="absolute left-4 top-4 text-slate-400" />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Describe your product, or click 'Generate with AI' above..."
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 text-sm transition-all resize-none ${
                    aiGeneratedFields.has("description") ? "border-violet-300 bg-violet-50/30" : "border-slate-200"
                  }`}
                  required
                />
              </div>
            </div>

            {/* SEO Tags */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                SEO Tags (comma separated) <AiBadge field="seoTags" />
              </label>
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="seoTags"
                  value={formData.seoTags}
                  onChange={handleChange}
                  placeholder="e.g. bluetooth, earbuds, audio, wireless"
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 text-sm transition-all ${
                    aiGeneratedFields.has("seoTags") ? "border-violet-300 bg-violet-50/30" : "border-slate-200"
                  }`}
                />
              </div>
              {/* Tag preview chips */}
              {formData.seoTags && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {formData.seoTags.split(",").filter(t => t.trim()).map((tag, i) => (
                    <span key={i} className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-full font-semibold">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Marketing Caption */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Social Media Caption <AiBadge field="marketingCaptions" />
              </label>
              <div className="relative">
                <FaBullhorn className="absolute left-4 top-4 text-slate-400" />
                <textarea
                  name="marketingCaptions"
                  value={formData.marketingCaptions}
                  onChange={handleChange}
                  rows="3"
                  placeholder="AI-generated post for Instagram / Twitter..."
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 text-sm transition-all resize-none ${
                    aiGeneratedFields.has("marketingCaptions") ? "border-violet-300 bg-violet-50/30" : "border-slate-200"
                  }`}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-3.5 rounded-xl hover:shadow-lg transition-all font-bold cursor-pointer text-sm disabled:opacity-50 shadow-md shadow-indigo-200"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <FaSpinner className="animate-spin text-xs" /> Adding Product...
                  </span>
                ) : "Add Product to Inventory"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="flex-1 border border-slate-200 text-slate-700 py-3.5 rounded-xl hover:bg-slate-50 transition-colors font-bold cursor-pointer text-sm"
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