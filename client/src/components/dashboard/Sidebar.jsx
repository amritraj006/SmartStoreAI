import {
  FaHome,
  FaBox,
  FaChartBar,
  FaCog,
  FaPlus,
} from "react-icons/fa";

import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 fixed h-screen bg-white shadow-lg p-5">
      <h1 className="text-2xl font-bold text-blue-600 mb-10">
        SmartStore AI
      </h1>

      <nav className="flex flex-col gap-4">
        <Link
          to="/"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50"
        >
          <FaHome />
          Dashboard
        </Link>

        <Link
          to="/products"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50"
        >
          <FaBox />
          Products
        </Link>

        <Link
          to="/add-product"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50"
        >
          <FaPlus />
          Add Product
        </Link>

        <Link
          to="/analytics"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50"
        >
          <FaChartBar />
          Analytics
        </Link>

        <Link
          to="/settings"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50"
        >
          <FaCog />
          Settings
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;