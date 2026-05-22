import {
  FaHome,
  FaBox,
  FaChartBar,
  FaCog,
  FaPlus,
  FaTimes,
  FaRobot,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

function Sidebar({ onClose }) {
  const navItems = [
    { to: "/", icon: FaHome, label: "Dashboard" },
    { to: "/products", icon: FaBox, label: "Products" },
    { to: "/add-product", icon: FaPlus, label: "Add Product" },
    { to: "/analytics", icon: FaChartBar, label: "Analytics" },
    { to: "/settings", icon: FaCog, label: "Settings" },
  ];

  return (
    <div className="w-72 h-screen bg-white shadow-2xl flex flex-col">
      {/* Logo section */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <FaRobot className="text-white text-sm" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
            SmartStore AI
          </h1>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-gray-400 hover:text-gray-600"
        >
          <FaTimes />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }
            `}
          >
            <item.icon className="text-lg" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-100">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">AI Version</p>
          <p className="text-sm font-semibold text-gray-700">v2.0.1</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;