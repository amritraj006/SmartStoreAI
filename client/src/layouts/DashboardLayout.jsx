import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed position */}
      <div className={`
        hidden lg:block fixed left-0 top-0 bottom-0 z-30 overflow-y-auto
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Mobile Sidebar */}
      <div className={`
        lg:hidden fixed left-0 top-0 bottom-0 z-30 transition-transform duration-300 overflow-y-auto
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 lg:ml-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;