import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-slate-950 text-slate-100 min-h-screen relative overflow-x-hidden select-none">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-[100px] animate-blob pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full filter blur-[100px] animate-blob animation-delay-2000 pointer-events-none" />

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm"
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
      <div className="flex-1 min-w-0 lg:ml-72 relative z-10">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;