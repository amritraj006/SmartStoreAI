import {
  FaBell,
  FaSearch,
  FaBars,
  FaSignOutAlt,
  FaCog,
  FaSpinner,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaShoppingCart,
  FaTimes,
  FaBox,
} from "react-icons/fa";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../services/api";

// Debounce hook
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// Relative time formatter
function timeAgo(isoStr) {
  const diff = Date.now() - new Date(isoStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const NOTIF_ICONS = {
  critical: <FaExclamationCircle className="text-red-400 mt-0.5 shrink-0 text-sm" />,
  warning:  <FaExclamationTriangle className="text-amber-400 mt-0.5 shrink-0 text-sm" />,
  success:  <FaShoppingCart className="text-emerald-400 mt-0.5 shrink-0 text-sm" />,
  info:     <FaInfoCircle className="text-blue-400 mt-0.5 shrink-0 text-sm" />,
};

const NOTIF_COLORS = {
  critical: "border-l-red-500 bg-red-950/20 border-b border-slate-800/50",
  warning:  "border-l-amber-500 bg-amber-950/20 border-b border-slate-800/50",
  success:  "border-l-emerald-500 bg-emerald-950/20 border-b border-slate-800/50",
  info:     "border-l-blue-500 bg-blue-950/20 border-b border-slate-800/50",
};

function Navbar({ onMenuClick }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ── Search state ────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);
  const debouncedQuery = useDebounce(searchQuery, 300);

  // ── Notifications state ──────────────────────────
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifLoading, setNotifLoading] = useState(false);
  const [readIds, setReadIds] = useState(new Set());
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.name || "Admin"
  )}&background=6366f1&color=fff&rounded=true&size=40`;

  // ── Search effect ────────────────────────────────
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }
    const fetch = async () => {
      setSearchLoading(true);
      try {
        const data = await api.get(`/products/search?q=${encodeURIComponent(debouncedQuery)}`);
        if (data.success) {
          setSearchResults(data.products);
          setShowSearch(true);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };
    fetch();
  }, [debouncedQuery]);

  // ── Load notifications ───────────────────────────
  const loadNotifications = useCallback(async () => {
    setNotifLoading(true);
    try {
      const data = await api.get("/notifications");
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch {
      setNotifications([]);
    } finally {
      setNotifLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, [loadNotifications]);

  // ── Close dropdowns on outside click ────────────
  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const getStatus = (stock) => {
    if (stock > 10) return { label: "In Stock", cls: "text-emerald-400 bg-emerald-950/40 border border-emerald-900/50" };
    if (stock > 0)  return { label: "Low Stock", cls: "text-amber-400 bg-amber-950/40 border border-amber-900/50" };
    return { label: "Out of Stock", cls: "text-red-400 bg-red-950/40 border border-red-900/50" };
  };

  const markAllRead = () => {
    const ids = new Set(notifications.map((n) => n.id));
    setReadIds(ids);
    setUnreadCount(0);
  };

  const effectiveUnread = Math.max(0, unreadCount - readIds.size);

  return (
    <nav className="glass sticky top-0 z-10 border-b border-slate-800/80 shadow-lg">
      <div className="px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: hamburger + search */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-slate-400 hover:text-slate-200 transition-colors p-1"
          >
            <FaBars className="text-lg" />
          </button>

          {/* Search bar */}
          <div className="hidden md:block flex-1 max-w-sm relative" ref={searchRef}>
            <div className="flex items-center bg-slate-950 border border-slate-800/80 rounded-2xl px-4 py-2.5 gap-3 hover:border-indigo-500/50 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/25 transition-all">
              {searchLoading ? (
                <FaSpinner className="text-indigo-400 text-sm animate-spin shrink-0" />
              ) : (
                <FaSearch className="text-slate-500 text-sm shrink-0" />
              )}
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm flex-1 text-slate-200 placeholder-slate-500"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setShowSearch(false); }}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showSearch && (
              <div className="search-dropdown animate-slide-down">
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-400">
                    No products found for "{searchQuery}"
                  </div>
                ) : (
                  <>
                    <div className="px-4 py-2.5 border-b border-slate-800">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} found
                      </p>
                    </div>
                    {searchResults.map((p) => {
                      const st = getStatus(p.stock);
                      return (
                        <button
                          key={p._id}
                          onClick={() => {
                            navigate("/products");
                            setShowSearch(false);
                            setSearchQuery("");
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800/60 transition-colors text-left border-b border-slate-800/50 last:border-0"
                        >
                          <div className="w-8 h-8 bg-slate-950 border border-slate-850 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                            {p.image ? (
                              <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                            ) : (
                              <FaBox className="text-indigo-400 text-xs" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-200 truncate">{p.title}</p>
                            <p className="text-xs text-slate-400 capitalize">{p.category}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-slate-200">${p.price}</p>
                            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${st.cls}`}>
                              {st.label}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                    <div className="p-2 border-t border-slate-800">
                      <button
                        onClick={() => { navigate("/products"); setShowSearch(false); setSearchQuery(""); }}
                        className="w-full text-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 py-1.5 transition-colors"
                      >
                        View all products →
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: notifications + profile */}
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) loadNotifications();
              }}
              className="relative p-2.5 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <FaBell className="text-slate-400 hover:text-slate-200 text-lg" />
              {effectiveUnread > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center animate-badge-pop">
                  {effectiveUnread > 9 ? "9+" : effectiveUnread}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 z-50 overflow-hidden animate-slide-down">
                {/* Header */}
                <div className="px-5 py-4 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <FaBell className="text-indigo-400 text-sm" />
                    <h3 className="font-bold text-slate-200 text-sm">Notifications</h3>
                    {effectiveUnread > 0 && (
                      <span className="bg-red-950/60 text-red-400 text-xs font-bold px-2 py-0.5 rounded-full border border-red-900/40">
                        {effectiveUnread} new
                      </span>
                    )}
                  </div>
                  {effectiveUnread > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                    >
                      <FaCheckCircle className="text-xs" /> Mark all read
                    </button>
                  )}
                </div>

                {/* Body */}
                <div className="max-h-80 overflow-y-auto">
                  {notifLoading ? (
                    <div className="flex items-center justify-center py-10 gap-2 text-slate-400">
                      <FaSpinner className="animate-spin text-indigo-500" />
                      <span className="text-sm">Loading...</span>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="py-10 text-center text-sm text-slate-400">
                      No notifications
                    </div>
                  ) : (
                    <div className="stagger">
                      {notifications.map((n) => {
                        const isRead = readIds.has(n.id) || n.read;
                        return (
                          <div
                            key={n.id}
                            className={`flex gap-3 px-5 py-3.5 border-l-[3px] border-b border-slate-800/40 last:border-b-0 animate-fade-in-up transition-all ${
                              NOTIF_COLORS[n.type] || "border-l-slate-600 bg-slate-900"
                            } ${isRead ? "opacity-60" : ""}`}
                          >
                            {NOTIF_ICONS[n.type]}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-xs font-bold text-slate-200">{n.title}</p>
                                <span className="text-[10px] text-slate-500 shrink-0">{timeAgo(n.time)}</span>
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/40">
                  <button
                    onClick={() => { loadNotifications(); }}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    ↻ Refresh notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User profile */}
          <div className="relative" ref={profileRef}>
            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 cursor-pointer hover:bg-slate-800 rounded-xl px-2 py-1.5 transition-colors select-none"
            >
              <img
                src={avatarUrl}
                alt="User avatar"
                className="w-9 h-9 rounded-xl object-cover border-2 border-indigo-500/30"
              />
              <div className="hidden md:block">
                <p className="font-bold text-slate-200 text-sm leading-tight">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs text-slate-400">{user?.storeName || "SmartStore AI"}</p>
              </div>
            </div>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 z-50 py-2 animate-slide-down">
                <div className="px-4 py-3 border-b border-slate-800">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Signed in as</p>
                  <p className="text-sm font-bold text-slate-200 truncate mt-0.5">{user?.email}</p>
                </div>
                <Link
                  to="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800/60 transition-colors"
                >
                  <FaCog className="text-slate-400" /> Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-950/40 transition-colors text-left border-t border-slate-800"
                >
                  <FaSignOutAlt className="text-red-400" /> Sign Out
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