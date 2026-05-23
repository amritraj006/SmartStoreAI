import {
  FaHome,
  FaBox,
  FaChartBar,
  FaCog,
  FaPlus,
  FaTimes,
  FaRobot,
  FaShoppingBag,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

function Sidebar({ onClose }) {
  const navItems = [
    { to: "/", icon: FaHome, label: "Dashboard", exact: true },
    { to: "/products", icon: FaBox, label: "Products" },
    { to: "/add-product", icon: FaPlus, label: "Add Product" },
    { to: "/analytics", icon: FaChartBar, label: "Analytics" },
    { to: "/settings", icon: FaCog, label: "Settings" },
  ];

  return (
    <div className="w-72 h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex flex-col sidebar-scroll overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <FaRobot className="text-white text-base" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">SmartStore</h1>
            <p className="text-xs text-indigo-400 font-semibold -mt-0.5">AI Dashboard</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-slate-400 hover:text-white transition-colors p-1"
        >
          <FaTimes />
        </button>
      </div>

      {/* Nav label */}
      <p className="px-6 pt-5 pb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
        Navigation
      </p>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
              ${
                isActive
                  ? "bg-indigo-600/20 text-white border border-indigo-500/30 shadow-lg shadow-indigo-500/10"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-indigo-400 rounded-r-full" />
                )}
                <item.icon
                  className={`text-base transition-colors ${
                    isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                  }`}
                />
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 m-3 mb-4 bg-gradient-to-r from-indigo-600/20 to-violet-600/20 rounded-2xl border border-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
            <FaShoppingBag className="text-indigo-400 text-sm" />
          </div>
          <div>
            <p className="text-white text-xs font-bold">SmartStore AI</p>
            <p className="text-indigo-400 text-xs">v2.0.1 · Pro</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-400">All systems online</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;