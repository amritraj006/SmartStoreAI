import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import {
  FaUser,
  FaBell,
  FaLock,
  FaPalette,
  FaGlobe,
  FaDatabase,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

function Settings() {
  const { user, updateProfile, forceSeedData } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  // Form states
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [storeName, setStoreName] = useState(user?.storeName || "");
  const [password, setPassword] = useState("");
  
  // Notice alerts
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const tabs = [
    { id: "profile", label: "Profile Settings", icon: FaUser },
    { id: "notifications", label: "Notifications", icon: FaBell },
    { id: "security", label: "Security & Keys", icon: FaLock },
    { id: "appearance", label: "Appearance", icon: FaPalette },
    { id: "preferences", label: "System Preferences", icon: FaGlobe },
  ];

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setIsUpdating(true);

    try {
      const res = await updateProfile(name, email, storeName, password || null);
      if (res.success) {
        setMessage({ type: "success", text: "Profile details updated successfully!" });
        setPassword("");
      } else {
        setMessage({ type: "error", text: res.message || "Failed to update profile." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An error occurred during updating." });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSeedDemoData = async () => {
    if (
      window.confirm(
        "Warning: This will wipe out all current products/orders for your account and seed fresh demo records. Do you wish to continue?"
      )
    ) {
      setMessage({ type: "", text: "" });
      setIsSeeding(true);

      try {
        const res = await forceSeedData();
        if (res.success) {
          setMessage({
            type: "success",
            text: "Database successfully re-seeded! Navigate back to the Dashboard to view new charts.",
          });
        } else {
          setMessage({ type: "error", text: res.message || "Failed to seed demo data." });
        }
      } catch (err) {
        setMessage({ type: "error", text: "An error occurred during data seeding." });
      } finally {
        setIsSeeding(false);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800/80 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-800">
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-slate-400 mt-1">Manage your account profile and database parameters</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-800 px-6">
            <div className="flex gap-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-1 py-4 border-b-2 transition-colors whitespace-nowrap text-sm font-semibold cursor-pointer ${
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-400"
                      : "border-transparent text-slate-450 hover:text-slate-200"
                  }`}
                >
                  <tab.icon className="text-sm" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback alerts */}
          {message.text && (
            <div
              className={`mx-6 mt-6 p-4 rounded-2xl border flex items-start gap-3 text-sm ${
                message.type === "success"
                  ? "bg-green-950/40 border-green-900/50 text-green-300"
                  : "bg-red-950/40 border-red-900/50 text-red-300"
              }`}
            >
              {message.type === "success" ? (
                <FaCheckCircle className="mt-0.5 shrink-0 text-green-500" />
              ) : (
                <FaExclamationCircle className="mt-0.5 shrink-0 text-red-500" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Profile Settings Form */}
          {activeTab === "profile" && (
            <div className="p-6 space-y-6">
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/35 focus:border-indigo-500 text-slate-100 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/35 focus:border-indigo-500 text-slate-100 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Store Name
                    </label>
                    <input
                      type="text"
                      required
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/35 focus:border-indigo-500 text-slate-100 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Update Password (optional)
                    </label>
                    <input
                      type="password"
                      placeholder="Leave blank to keep same"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/35 focus:border-indigo-500 text-slate-100 text-sm"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer text-sm disabled:opacity-50"
                  >
                    {isUpdating ? "Saving Changes..." : "Save Changes"}
                  </button>
                </div>
              </form>

              {/* Seeding section */}
              <div className="pt-8 border-t border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                  <FaDatabase className="text-indigo-400 text-base" />
                  Demonstration & Seeding Options
                </h3>
                <p className="text-sm text-slate-400 max-w-2xl mb-4 leading-relaxed">
                  To experience the full analytics suite, you can re-seed sample products and 6 months of historical orders. 
                  This will flush current listings and reset the store workspace.
                </p>
                <button
                  type="button"
                  onClick={handleSeedDemoData}
                  disabled={isSeeding}
                  className="bg-blue-950/30 border border-blue-900/50 text-blue-300 hover:bg-blue-900/40 px-5 py-3 rounded-xl font-bold transition flex items-center gap-2 text-sm cursor-pointer disabled:opacity-50"
                >
                  {isSeeding ? (
                    <>
                      <FaSpinner className="animate-spin text-sm" />
                      Flushing & Seeding database...
                    </>
                  ) : (
                    <>
                      <FaDatabase className="text-xs" />
                      Wipe and Re-seed Store Demo Data
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Placeholders */}
          {activeTab !== "profile" && (
            <div className="p-16 text-center text-slate-400 text-sm">
              <p className="font-semibold text-slate-350">{tabs.find((t) => t.id === activeTab)?.label} Settings</p>
              <p className="text-xs mt-1 text-slate-500">This section is managed by organization presets and is configured automatically.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Settings;