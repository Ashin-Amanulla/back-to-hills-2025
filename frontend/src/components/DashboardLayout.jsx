import { useState } from "react";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 lg:hidden bg-white shadow px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            Admin Dashboard
          </h1>
          <div className="w-6"></div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
            <div className="my-6 text-center">
            <p className="text-sm text-gray-500"> Created by  <a href="https://www.xyvin.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500"> Xyvin Technologies </a> </p>
            <p className="text-sm text-gray-500"> © 2025 JNV Calicut Alumni Network. All rights reserved. </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
