import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import StatsCard from "../components/dashboard/StatsCard";
import RevenueChart from "../components/dashboard/RevenueChart";
import TopProducts from "../components/dashboard/TopProducts";
import AISuggestions from "../components/dashboard/AISuggestions";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  FaDollarSign,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaSpinner,
  FaExclamationCircle,
  FaPlus,
  FaChartBar,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

// Toast component matching other pages
function Toast({ message, type, onClose }) {
  return (
    <div className={`animate-toast-in toast toast-${type} shadow-xl`}>
      <FaCheckCircle className="shrink-0 mt-0.5 text-white" />
      <div className="flex-1">
        <p className="font-semibold text-sm">{message}</p>
      </div>
      <button onClick={onClose} className="opacity-70 hover:opacity-100">✕</button>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await api.get("/analytics/dashboard");
        if (data.success) {
          setAnalytics(data);
        } else {
          setError("Failed to load analytics data");
        }
      } catch (err) {
        setError("Error communicating with the server.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const statsConfig = [
    {
      title: "Total Revenue",
      key: "totalRevenue",
      icon: <FaDollarSign />,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      trend: 12.5,
      default: "$0",
    },
    {
      title: "Products Listed",
      key: "productsCount",
      icon: <FaBox />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      trend: 8.3,
      default: 0,
    },
    {
      title: "Orders Completed",
      key: "ordersCount",
      icon: <FaShoppingCart />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      trend: 4.2,
      default: 0,
    },
    {
      title: "Active Customers",
      key: "customersCount",
      icon: <FaUsers />,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
      trend: 9.8,
      default: 0,
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 gap-4">
          <FaSpinner className="animate-spin text-4xl text-indigo-500" />
          <p className="text-sm font-medium">Aggregating store metrics and insights...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-red-700 flex items-center gap-3">
          <FaExclamationCircle className="text-xl shrink-0" />
          <div>
            <h3 className="font-bold">Failed to Load Dashboard</h3>
            <p className="text-sm text-red-500 mt-1">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Welcome Banner */}
      <div className="mb-8 relative overflow-hidden bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 rounded-2xl p-7 text-white shadow-xl shadow-indigo-200/40 animate-gradient">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-indigo-200 text-sm font-semibold mb-1">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">
              Welcome back, {user?.name || "Admin"}! 👋
            </h1>
            <p className="text-indigo-200 text-sm">
              Here's what's happening with{" "}
              <span className="font-bold text-white">{user?.storeName || "your store"}</span> today.
            </p>
          </div>
          {/* Quick actions */}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => navigate("/add-product")}
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all backdrop-blur-sm"
            >
              <FaPlus className="text-xs" /> Add Product
            </button>
            <button
              onClick={() => navigate("/analytics")}
              className="flex items-center gap-2 bg-white text-indigo-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
            >
              <FaChartBar className="text-xs" /> Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger">
        {statsConfig.map((item) => (
          <StatsCard
            key={item.key}
            title={item.title}
            value={analytics?.stats?.[item.key] ?? item.default}
            icon={item.icon}
            color={item.color}
            bgColor={item.bgColor}
            trend={item.trend}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <RevenueChart
            labels={analytics?.chart?.labels}
            chartData={analytics?.chart?.data}
          />
        </div>
        <div>
          <AISuggestions />
        </div>
      </div>

      {/* Top Products */}
      <div className="mt-8">
        <TopProducts products={analytics?.topProducts} />
      </div>

      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-black text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/add-product")}
            className="group flex items-center justify-between bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-md rounded-2xl p-5 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                <FaPlus className="text-indigo-500" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Add Product</p>
                <p className="text-xs text-slate-400">Launch AI descriptions</p>
              </div>
            </div>
            <FaArrowRight className="text-slate-300 group-hover:text-indigo-400 transition-colors shrink-0" />
          </button>
          
          <button
            onClick={() => navigate("/analytics")}
            className="group flex items-center justify-between bg-white border border-slate-100 hover:border-violet-200 hover:shadow-md rounded-2xl p-5 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
                <FaChartBar className="text-violet-500" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">View Analytics</p>
                <p className="text-xs text-slate-400">Track store conversions</p>
              </div>
            </div>
            <FaArrowRight className="text-slate-300 group-hover:text-violet-400 transition-colors shrink-0" />
          </button>

          <button
            onClick={() => {
              showToast("Syncing with sales channels... All order flows operational! 📦");
            }}
            className="group flex items-center justify-between bg-white border border-slate-100 hover:border-orange-200 hover:shadow-md rounded-2xl p-5 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <FaShoppingCart className="text-orange-500" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Manage Orders</p>
                <p className="text-xs text-slate-400">Process shipping & sales</p>
              </div>
            </div>
            <FaArrowRight className="text-slate-300 group-hover:text-orange-400 transition-colors shrink-0" />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;