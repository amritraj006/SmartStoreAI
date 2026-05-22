import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import RevenueChart from "../components/dashboard/RevenueChart";
import { api } from "../services/api";
import {
  FaChartLine,
  FaShoppingCart,
  FaUsers,
  FaDollarSign,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";

function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get("/analytics/dashboard");
        if (response.success) {
          setData(response);
        }
      } catch (err) {
        console.error("Failed to load analytics:", err);
        setError("Could not retrieve store performance analytics.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 gap-4">
          <FaSpinner className="animate-spin text-4xl text-blue-600" />
          <p className="text-sm font-medium">Aggregating historical order metrics...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-red-700 flex items-center gap-3">
          <FaExclamationCircle className="text-xl shrink-0" />
          <span>{error}</span>
        </div>
      </DashboardLayout>
    );
  }

  // Parse total revenue number
  const rawRevenue = Number((data?.stats?.totalRevenue || "$0").replace(/[^0-9.-]+/g, ""));
  const ordersCount = data?.stats?.ordersCount || 0;
  const avgOrderValue = ordersCount > 0 ? Math.round(rawRevenue / ordersCount) : 0;
  const lifetimeValue = ordersCount > 0 ? Math.round(rawRevenue / Math.max(1, data?.stats?.customersCount || 1)) : 0;

  const metrics = [
    { label: "Conversion Rate", value: "3.24%", change: "+0.5%", icon: FaChartLine },
    { label: "Avg Order Value", value: `$${avgOrderValue.toLocaleString()}`, change: "Calculated", icon: FaShoppingCart },
    { label: "Customer LTV", value: `$${lifetimeValue.toLocaleString()}`, change: "Calculated", icon: FaUsers },
    { label: "ROAS", value: "4.2x", change: "+0.3x", icon: FaDollarSign },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your store performance metrics</p>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-2">{metric.value}</p>
                  <p className={`text-xs mt-1 ${metric.change === "Calculated" ? "text-gray-400 font-semibold" : "text-green-600"}`}>
                    {metric.change}
                  </p>
                </div>
                <metric.icon className="text-2xl text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <RevenueChart
          labels={data?.chart?.labels}
          chartData={data?.chart?.data}
        />
      </div>
    </DashboardLayout>
  );
}

export default Analytics;