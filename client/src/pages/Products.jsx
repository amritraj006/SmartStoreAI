import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { api } from "../services/api";
import {
  FaSearch,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSpinner,
  FaExclamationTriangle,
  FaMagic,
  FaTimes,
} from "react-icons/fa";

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'in-stock', 'low-stock', 'out-of-stock'

  // Modal states
  const [viewingProduct, setViewingProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    seoTags: "",
    marketingCaptions: "",
  });
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const data = await api.get("/products");
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Fetch products error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getStatus = (stock) => {
    if (stock > 10) return "In Stock";
    if (stock > 0) return "Low Stock";
    return "Out of Stock";
  };

  const getStatusColor = (status) => {
    if (status === "In Stock") return "bg-green-100 text-green-700";
    if (status === "Low Stock") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  // Delete product
  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This will also remove its sales history.`)) {
      try {
        const data = await api.delete(`/products/${id}`);
        if (data.success) {
          setProducts(products.filter((p) => p._id !== id));
        }
      } catch (error) {
        alert(error.message || "Failed to delete product");
      }
    }
  };

  // Open Edit Modal
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
    setSubmitError("");
  };

  // Save changes
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setIsSaving(true);

    try {
      const tagsArray = editFormData.seoTags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const payload = {
        ...editFormData,
        price: Number(editFormData.price),
        stock: Number(editFormData.stock),
        seoTags: tagsArray,
      };

      const data = await api.put(`/products/${editingProduct._id}`, payload);
      if (data.success) {
        setProducts(
          products.map((p) => (p._id === editingProduct._id ? data.product : p))
        );
        setEditingProduct(null);
      }
    } catch (error) {
      setSubmitError(error.message || "Failed to update product");
    } finally {
      setIsSaving(false);
    }
  };

  // Regenerate with AI inside Edit Modal
  const handleEditAIGenerate = async () => {
    if (!editFormData.title) {
      alert("Title is required to generate AI content!");
      return;
    }
    setIsRegenerating(true);
    try {
      const payload = {
        title: editFormData.title,
        category: editFormData.category,
        price: editFormData.price,
      };
      const response = await api.post("/products/generate-ai", payload);
      if (response.success && response.data) {
        setEditFormData((prev) => ({
          ...prev,
          description: response.data.description || prev.description,
          seoTags: response.data.seoTags ? response.data.seoTags.join(", ") : prev.seoTags,
          marketingCaptions: response.data.marketingCaptions || prev.marketingCaptions,
        }));
      }
    } catch (error) {
      alert("AI content generation failed. Using fallbacks.");
    } finally {
      setIsRegenerating(false);
    }
  };

  // Filters logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const status = getStatus(product.stock);

    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "in-stock") return matchesSearch && status === "In Stock";
    if (filterStatus === "low-stock") return matchesSearch && status === "Low Stock";
    if (filterStatus === "out-of-stock") return matchesSearch && status === "Out of Stock";
    return matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Products</h1>
              <p className="text-gray-500 mt-1">Manage your product inventory and AI content</p>
            </div>
            <button
              onClick={() => navigate("/add-product")}
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all flex items-center gap-2 self-start cursor-pointer"
            >
              <FaPlus className="text-sm" />
              Add Product
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            
            {/* Status Select Filter */}
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="in-stock">In Stock (&gt;10)</option>
                <option value="low-stock">Low Stock (1-10)</option>
                <option value="out-of-stock">Out of Stock (0)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3">
            <FaSpinner className="animate-spin text-3xl text-blue-600" />
            <p className="text-sm">Loading product catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm mt-1">Try modifying your filters or add a new product to start seeding AI copy!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left p-6 font-semibold text-gray-600 text-sm">Product Name</th>
                  <th className="text-left p-6 font-semibold text-gray-600 text-sm">Category</th>
                  <th className="text-left p-6 font-semibold text-gray-600 text-sm">Price</th>
                  <th className="text-left p-6 font-semibold text-gray-600 text-sm">Stock</th>
                  <th className="text-left p-6 font-semibold text-gray-600 text-sm">Status</th>
                  <th className="text-left p-6 font-semibold text-gray-600 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => {
                  const status = getStatus(product.stock);
                  return (
                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-6 font-semibold text-gray-800">{product.title}</td>
                      <td className="p-6 text-gray-600 text-sm capitalize">{product.category}</td>
                      <td className="p-6 text-gray-800 font-medium">${product.price}</td>
                      <td className="p-6 text-gray-600 text-sm">{product.stock} units</td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
                          {status}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setViewingProduct(product)}
                            title="View AI Copy details"
                            className="p-2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => openEditModal(product)}
                            title="Edit product info"
                            className="p-2 text-gray-500 hover:text-green-600 transition-colors cursor-pointer"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id, product.title)}
                            title="Remove product"
                            className="p-2 text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <FaTrash />
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

      {/* VIEW PRODUCT MODAL (Read-only AI Details) */}
      {viewingProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setViewingProduct(null)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <FaTimes className="text-lg" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 pr-12">{viewingProduct.title}</h2>
            <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-wider">{viewingProduct.category}</p>

            <div className="mt-6 space-y-6">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h4>
                <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-2xl p-4">{viewingProduct.description}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">SEO Meta Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {viewingProduct.seoTags && viewingProduct.seoTags.length > 0 ? (
                    viewingProduct.seoTags.map((tag, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-xl text-xs font-semibold border border-blue-100">
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500 italic">No SEO tags generated.</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Social Marketing Caption</h4>
                <p className="text-gray-700 text-sm leading-relaxed bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 font-mono select-all">
                  {viewingProduct.marketingCaptions || <span className="text-gray-500 italic">No marketing caption generated.</span>}
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setViewingProduct(null)}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition cursor-pointer text-sm"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL (AI-powered inline editor) */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <FaTimes className="text-lg" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
            <p className="text-sm text-gray-500 mt-1">Modify fields or click "Generate" to recalculate descriptions with AI</p>

            {submitError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-sm">
                <FaExclamationTriangle className="shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="mt-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Product Title</label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm focus:outline-none"
                />
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stock Level</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editFormData.stock}
                    onChange={(e) => setEditFormData({ ...editFormData, stock: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                <input
                  type="text"
                  value={editFormData.category}
                  onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm focus:outline-none"
                />
              </div>

              {/* AI Trigger Line */}
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-gray-400">💡 Modify title, price, or category and trigger AI to rewrite copywriting fields!</span>
                <button
                  type="button"
                  onClick={handleEditAIGenerate}
                  disabled={isRegenerating}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <FaMagic />
                  {isRegenerating ? "Rewriting..." : "Rewrite fields with AI"}
                </button>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  rows="4"
                  required
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm focus:outline-none"
                />
              </div>

              {/* SEO Tags */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">SEO tags (comma separated)</label>
                <input
                  type="text"
                  value={editFormData.seoTags}
                  onChange={(e) => setEditFormData({ ...editFormData, seoTags: e.target.value })}
                  placeholder="wireless, audio, headphones"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm focus:outline-none"
                />
              </div>

              {/* Marketing Captions */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Marketing Caption</label>
                <textarea
                  rows="2"
                  value={editFormData.marketingCaptions}
                  onChange={(e) => setEditFormData({ ...editFormData, marketingCaptions: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm focus:outline-none"
                />
              </div>

              <div className="mt-8 flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition cursor-pointer text-sm disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Product Details"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition cursor-pointer text-sm"
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