import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/50 flex overflow-hidden">
      {/* Navigation Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-10">
          <div className="max-w-6xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
