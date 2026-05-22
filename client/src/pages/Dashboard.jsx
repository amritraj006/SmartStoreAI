import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import StatsCard from "../components/dashboard/StatsCard";
import RevenueChart from "../components/dashboard/RevenueChart";
import TopProducts from "../components/dashboard/TopProducts";
import AISuggestions from "../components/dashboard/AISuggestions";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import {
  FaDollarSign,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";

function Dashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        console.error("Dashboard data load error:", err);
        setError("Error communicating with the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const icons = [FaDollarSign, FaBox, FaShoppingCart, FaUsers];
  const colors = ["text-green-600", "text-blue-600", "text-orange-600", "text-purple-600"];
  const trends = [12.5, 8.3, 4.2, 9.8]; // Mock trends for layout aesthetics

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 gap-4">
          <FaSpinner className="animate-spin text-4xl text-blue-600" />
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
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Map API stats to dashboard cards
  const statsList = [
    { title: "Total Revenue", value: analytics?.stats?.totalRevenue || "$0" },
    { title: "Products Listed", value: analytics?.stats?.productsCount || 0 },
    { title: "Orders Completed", value: analytics?.stats?.ordersCount || 0 },
    { title: "Active Customers", value: analytics?.stats?.customersCount || 0 },
  ];

  return (
    <DashboardLayout>
      {/* Welcome banner */}
      <div className="mb-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name || "Admin"}! 👋</h1>
        <p className="text-blue-100">
          Here's what's happening with <span className="font-semibold text-white">{user?.storeName || "your store"}</span> today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsList.map((item, index) => {
          const Icon = icons[index];
          return (
            <StatsCard
              key={index}
              title={item.title}
              value={item.value}
              icon={<Icon />}
              color={colors[index]}
              trend={trends[index]}
            />
          );
        })}
      </div>

      {/* Charts and insights */}
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

      {/* Products table */}
      <div className="mt-8">
        <TopProducts products={analytics?.topProducts} />
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;