import DashboardLayout from "../layouts/DashboardLayout";

import StatsCard from "../components/dashboard/StatsCard";
import RevenueChart from "../components/dashboard/RevenueChart";
import TopProducts from "../components/dashboard/TopProducts";
import AISuggestions from "../components/dashboard/AISuggestions";

import { statsData } from "../data/dummyData";

import {
  FaDollarSign,
  FaBox,
  FaShoppingCart,
  FaUsers,
} from "react-icons/fa";

function Dashboard() {
  const icons = [
    <FaDollarSign />,
    <FaBox />,
    <FaShoppingCart />,
    <FaUsers />,
  ];

  const colors = [
    "text-green-500",
    "text-blue-500",
    "text-orange-500",
    "text-purple-500",
  ];

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((item, index) => (
          <StatsCard
            key={index}
            title={item.title}
            value={item.value}
            icon={icons[index]}
            color={colors[index]}
          />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>

        <AISuggestions />
      </div>

      <div className="mt-8">
        <TopProducts />
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;