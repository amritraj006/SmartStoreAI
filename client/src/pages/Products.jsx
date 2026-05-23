import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { api } from "../services/api";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSpinner,
  FaExclamationTriangle,
  FaMagic,
  FaTimes,
  FaBox,
  FaRobot,
  FaCheckCircle,
  FaTag,
} from "react-icons/fa";

const AI_STEPS = [
  "Analyzing product context...",
  "Writing description...",
  "Generating SEO tags...",
  "Crafting marketing copy...",
];

function Toast({ message, type, onClose }) {
  return (
    <div className={`animate-toast-in toast toast-${type} shadow-xl`}>
      <FaCheckCircle className="shrink-0" />
      <p className="flex-1 text-sm font-semibold">{message}</p>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 text-xs">✕</button>
    </div>
  );
}

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [toast, setToast] = useState(null);

  // Modal states
  const [viewingProduct, setViewingProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "", price: "", stock: "", category: "", description: "", seoTags: "", marketingCaptions: "",
  });
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [aiStep, setAiStep] = useState(0);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiGeneratedFields, setAiGeneratedFields] = useState(new Set());
  const [submitError, setSubmitError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = async () => {
    try {
      const data = await api.get("/products");
      if (data.success) setProducts(data.products);
    } catch (error) {
      console.error("Fetch products error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const getStatus = (stock) => {
    if (stock > 10) return "In Stock";
    if (stock > 0)  return "Low Stock";
    return "Out of Stock";
  };

  const getStatusStyle = (status) => {
    if (status === "In Stock")    return "bg-emerald-950/40 text-emerald-400 border-emerald-900/50";
    if (status === "Low Stock")   return "bg-amber-950/40 text-amber-400 border-amber-900/50";
    return "bg-red-950/40 text-red-400 border-red-900/50";
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete "${title}"? This will also remove its sales history.`)) {
      try {
        const data = await api.delete(`/products/${id}`);
        if (data.success) {
          setProducts(products.filter((p) => p._id !== id));
          showToast(`"${title}" removed from inventory.`);
        }
      } catch (error) {
        showToast(error.message || "Failed to delete product", "error");
      }
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditFormData({
      title: product.title,
      price: product.price,
      stock: product.stock,
      category: product.category,
      description: product.description,
      seoTags: product.seoTags ? product.seoTags.join(", ") : "",
      marketingCaptions: product.marketingCaptions || "",
    });
    setAiGeneratedFields(new Set());
    setSubmitError("");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setIsSaving(true);
    try {
      const tagsArray = editFormData.seoTags
        .split(",").map((t) => t.trim()).filter((t) => t.length > 0);
      const payload = {
        ...editFormData,
        price: Number(editFormData.price),
        stock: Number(editFormData.stock),
        seoTags: tagsArray,
      };
      const data = await api.put(`/products/${editingProduct._id}`, payload);
      if (data.success) {
        setProducts(products.map((p) => (p._id === editingProduct._id ? data.product : p)));
        setEditingProduct(null);
        showToast("Product updated successfully! ✓");
      }
    } catch (error) {
      setSubmitError(error.message || "Failed to update product");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditAIGenerate = async () => {
    if (!editFormData.title) {
      alert("Title is required to generate AI content!");
      return;
    }
    setIsRegenerating(true);
    setAiStep(0);
    setAiProgress(0);

    const stepInterval = setInterval(() => {
      setAiStep((prev) => {
        const next = Math.min(prev + 1, AI_STEPS.length - 1);
        setAiProgress(Math.round(((next + 1) / AI_STEPS.length) * 90));
        return next;
      });
    }, 500);

    try {
      const payload = {
        title: editFormData.title,
        category: editFormData.category,
        price: editFormData.price,
      };
      const response = await api.post("/products/generate-ai", payload);
      if (response.success && response.data) {
        clearInterval(stepInterval);
        setAiProgress(100);
        setEditFormData((prev) => ({
          ...prev,
          description: response.data.description || prev.description,
          seoTags: response.data.seoTags ? response.data.seoTags.join(", ") : prev.seoTags,
          marketingCaptions: response.data.marketingCaptions || prev.marketingCaptions,
        }));
        setAiGeneratedFields(new Set(["description", "seoTags", "marketingCaptions"]));
        showToast("AI content regenerated! ✨");
      }
    } catch (error) {
      clearInterval(stepInterval);
      showToast("AI generation failed. Try again.", "error");
    } finally {
      setTimeout(() => {
        setIsRegenerating(false);
        setAiStep(0);
        setAiProgress(0);
      }, 500);
    }
  };

  const filteredProducts = products.filter((product) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      product.title.toLowerCase().includes(q) ||
      (product.category || "").toLowerCase().includes(q);
    const status = getStatus(product.stock);
    if (filterStatus === "all")          return matchesSearch;
    if (filterStatus === "in-stock")     return matchesSearch && status === "In Stock";
    if (filterStatus === "low-stock")    return matchesSearch && status === "Low Stock";
    if (filterStatus === "out-of-stock") return matchesSearch && status === "Out of Stock";
    return matchesSearch;
  });

  const AiBadge = ({ field }) =>
    aiGeneratedFields.has(field) ? (
      <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-violet-400 bg-violet-950/40 border border-violet-900/50 px-2 py-0.5 rounded-full">
        <FaRobot className="text-[8px]" /> AI
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

      <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800/80 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-950/40 to-slate-900/20">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-white">Products</h1>
              <p className="text-slate-450 text-sm mt-0.5">
                {products.length} products · {filteredProducts.length} shown
              </p>
            </div>
            <button
              onClick={() => navigate("/add-product")}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center gap-2 self-start font-bold text-sm"
            >
              <FaPlus className="text-xs" /> Add Product
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/30">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
              <input
                type="text"
                placeholder="Search by product name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-slate-950 text-slate-200 placeholder-slate-500 text-sm transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-slate-950 text-slate-300 text-sm transition-all"
            >
              <option value="all">All Statuses</option>
              <option value="in-stock">In Stock (&gt;10)</option>
              <option value="low-stock">Low Stock (1–10)</option>
              <option value="out-of-stock">Out of Stock (0)</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <FaSpinner className="animate-spin text-3xl text-indigo-500" />
            <p className="text-sm">Loading product catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <FaBox className="text-5xl mx-auto mb-4 text-slate-200" />
            <p className="text-base font-semibold text-slate-500">No products found</p>
            <p className="text-sm mt-1">
              {searchTerm ? `No results for "${searchTerm}"` : "Add your first product to get started!"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-950/40 border-b border-slate-800">
                <tr>
                  {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-6 py-4 text-xs font-black text-slate-450 uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((product) => {
                  const status = getStatus(product.stock);
                  return (
                    <tr key={product._id} className="hover:bg-slate-800/35 transition-colors group animate-fade-in-up">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center shrink-0">
                            <FaBox className="text-indigo-400 text-sm" />
                          </div>
                          <span className="font-bold text-slate-200 text-sm">{product.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm capitalize">
                        <span className="bg-slate-950 text-slate-400 border border-slate-850 px-2.5 py-1 rounded-lg text-xs font-semibold">
                          {product.category || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black text-white">${product.price}</td>
                      <td className="px-6 py-4 text-slate-300 text-sm font-medium">{product.stock} units</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(status)}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setViewingProduct(product)}
                            title="View AI Copy"
                            className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-all"
                          >
                            <FaEye className="text-sm" />
                          </button>
                          <button
                            onClick={() => openEditModal(product)}
                            title="Edit product"
                            className="p-2 rounded-lg text-slate-400 hover:text-emerald-450 hover:bg-emerald-950/30 transition-all"
                          >
                            <FaEdit className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id, product.title)}
                            title="Delete product"
                            className="p-2 rounded-lg text-slate-400 hover:text-red-450 hover:bg-red-950/30 transition-all"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* VIEW MODAL */}
      {viewingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative border border-slate-800 animate-fade-in-up">
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white">{viewingProduct.title}</h2>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mt-1 block">
                  {viewingProduct.category}
                </span>
              </div>
              <button
                onClick={() => setViewingProduct(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-all shrink-0"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xs font-black text-slate-450 uppercase tracking-widest mb-2">Description</h4>
                <p className="text-slate-300 text-sm leading-relaxed bg-slate-900/60 rounded-2xl p-4 border border-slate-800">
                  {viewingProduct.description || <span className="italic text-slate-550">No description.</span>}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-455 uppercase tracking-widest mb-2">SEO Meta Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {viewingProduct.seoTags?.length > 0 ? (
                    viewingProduct.seoTags.map((tag, idx) => (
                      <span key={idx} className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-xl text-xs font-bold border border-indigo-500/20">
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-555 italic">No SEO tags generated.</span>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-455 uppercase tracking-widest mb-2">Social Marketing Caption</h4>
                <p className="text-violet-300 text-sm leading-relaxed bg-violet-950/20 border border-violet-900/40 rounded-2xl p-4 font-mono select-all">
                  {viewingProduct.marketingCaptions || <span className="italic text-slate-555">No caption generated.</span>}
                </p>
              </div>
            </div>

            <div className="p-5 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => { setViewingProduct(null); openEditModal(viewingProduct); }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition text-sm flex items-center gap-2"
              >
                <FaEdit className="text-xs" /> Edit Product
              </button>
              <button
                onClick={() => setViewingProduct(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold rounded-xl transition text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative border border-slate-800 animate-fade-in-up">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white">Edit Product</h2>
                <p className="text-xs text-slate-400 mt-0.5">Modify details or regenerate with AI</p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-all"
              >
                <FaTimes />
              </button>
            </div>

            {submitError && (
              <div className="mx-6 mt-4 p-4 bg-red-955/40 border border-red-900/50 rounded-xl flex items-center gap-3 text-red-200 text-sm">
                <FaExclamationTriangle className="shrink-0 text-red-500" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-black text-slate-455 uppercase tracking-widest mb-2">Product Title</label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/35 focus:border-indigo-500 text-sm focus:outline-none text-white transition-all"
                />
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-455 uppercase tracking-widest mb-2">Price ($)</label>
                  <input
                    type="number" required min="0"
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/35 focus:border-indigo-500 text-sm focus:outline-none text-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-455 uppercase tracking-widest mb-2">Stock Level</label>
                  <input
                    type="number" required min="0"
                    value={editFormData.stock}
                    onChange={(e) => setEditFormData({ ...editFormData, stock: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/35 focus:border-indigo-500 text-sm focus:outline-none text-white transition-all"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-black text-slate-455 uppercase tracking-widest mb-2">Category</label>
                <input
                  type="text"
                  value={editFormData.category}
                  onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/35 focus:border-indigo-500 text-sm focus:outline-none text-white transition-all"
                />
              </div>

              {/* AI regenerate panel */}
              <div className="bg-gradient-to-r from-indigo-950/20 to-violet-950/20 border border-indigo-900/40 rounded-2xl p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FaMagic className="text-indigo-400" />
                    <div>
                      <p className="text-xs font-bold text-indigo-250">AI Content Engine</p>
                      <p className="text-[11px] text-indigo-455">Rewrites description, SEO & captions</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleEditAIGenerate}
                    disabled={isRegenerating}
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all hover:shadow-md disabled:opacity-50 cursor-pointer btn-ai-glow"
                  >
                    <FaMagic className="text-[10px]" />
                    {isRegenerating ? "Generating..." : "Rewrite with AI"}
                  </button>
                </div>
                {isRegenerating && (
                  <div className="mt-3 animate-fade-in-up">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[11px] font-semibold text-indigo-400">{AI_STEPS[aiStep]}</p>
                      <p className="text-[11px] font-bold text-indigo-400">{aiProgress}%</p>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
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
                <label className="block text-xs font-black text-slate-455 uppercase tracking-widest mb-2">
                  Description <AiBadge field="description" />
                </label>
                <textarea
                  rows="4" required
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className={`w-full px-4 py-3 bg-slate-950 border rounded-xl focus:ring-2 focus:ring-indigo-500/35 focus:border-indigo-500 text-sm focus:outline-none text-white transition-all resize-none ${
                    aiGeneratedFields.has("description") ? "border-violet-900/40 bg-violet-950/20" : "border-slate-800"
                  }`}
                />
              </div>

              {/* SEO Tags */}
              <div>
                <label className="block text-xs font-black text-slate-455 uppercase tracking-widest mb-2">
                  SEO Tags (comma separated) <AiBadge field="seoTags" />
                </label>
                <input
                  type="text"
                  value={editFormData.seoTags}
                  onChange={(e) => setEditFormData({ ...editFormData, seoTags: e.target.value })}
                  placeholder="wireless, audio, headphones"
                  className={`w-full px-4 py-3 bg-slate-950 border rounded-xl focus:ring-2 focus:ring-indigo-500/35 focus:border-indigo-500 text-sm focus:outline-none text-white transition-all ${
                    aiGeneratedFields.has("seoTags") ? "border-violet-900/40 bg-violet-950/20" : "border-slate-800"
                  }`}
                />
                {editFormData.seoTags && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {editFormData.seoTags.split(",").filter(t => t.trim()).map((tag, i) => (
                      <span key={i} className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full font-semibold">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Marketing Caption */}
              <div>
                <label className="block text-xs font-black text-slate-455 uppercase tracking-widest mb-2">
                  Marketing Caption <AiBadge field="marketingCaptions" />
                </label>
                <textarea
                  rows="2"
                  value={editFormData.marketingCaptions}
                  onChange={(e) => setEditFormData({ ...editFormData, marketingCaptions: e.target.value })}
                  className={`w-full px-4 py-3 bg-slate-950 border rounded-xl focus:ring-2 focus:ring-indigo-500/35 focus:border-indigo-500 text-sm focus:outline-none text-white transition-all resize-none ${
                    aiGeneratedFields.has("marketingCaptions") ? "border-violet-900/40 bg-violet-950/20" : "border-slate-800"
                  }`}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all text-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaSpinner className="animate-spin text-xs" /> Saving...
                    </span>
                  ) : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 border border-slate-800 bg-slate-900 text-slate-350 hover:bg-slate-800 font-bold py-3 rounded-xl transition-colors text-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Products;