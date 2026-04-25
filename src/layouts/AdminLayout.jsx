import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import TopBar from "../components/admin/TopBar";
import Footer from "../components/admin/Footer";
import { useState } from "react";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Bar */}
      <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1">
        {/* Sidebar - Responsive */}
        <div className={`
          fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar setSidebarOpen={setSidebarOpen} />
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}