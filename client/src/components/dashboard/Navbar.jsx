import { FaBell, FaSearch, FaBars, FaSignOutAlt, FaCog } from "react-icons/fa";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Navbar({ onMenuClick }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "A";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Admin")}&background=2563eb&color=fff&rounded=true&size=40`;

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100">
      <div className="px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            <FaBars className="text-xl" />
          </button>
          
          {/* Search bar */}
          <div className="hidden md:flex items-center bg-gray-50 rounded-xl px-4 py-2 min-w-[300px]">
            <FaSearch className="text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search products, orders..."
              className="bg-transparent ml-3 outline-none text-sm flex-1"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <FaBell className="text-gray-600 text-lg" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Notification dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-2">
                <div className="p-3 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                </div>
                <div className="p-4 text-center text-gray-500 text-xs">
                  All systems operational. Seeded demo data is active.
                </div>
              </div>
            )}
          </div>

          {/* User profile dropdown */}
          <div className="relative">
            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-xl p-2 transition-colors select-none"
            >
              <img
                src={avatarUrl}
                alt="User avatar"
                className="w-10 h-10 rounded-xl object-cover border border-blue-100"
              />
              <div className="hidden md:block">
                <p className="font-semibold text-gray-800 text-sm">{user?.name || "Admin User"}</p>
                <p className="text-xs text-gray-500">{user?.storeName || "SmartStore AI"}</p>
              </div>
            </div>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-2">
                <div className="px-4 py-2 border-b border-gray-50">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Signed in as</p>
                  <p className="text-sm font-bold text-gray-800 truncate mt-0.5">{user?.email}</p>
                </div>
                
                <Link
                  to="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FaCog className="text-gray-400" />
                  Settings
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/50 transition-colors text-left cursor-pointer border-t border-gray-50"
                >
                  <FaSignOutAlt className="text-red-400" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;