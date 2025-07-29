import React from "react";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const ProtectedLayout = ({ onLogout }) => {
  return (
    <div className="flex min-h-screen bg-[#030712] text-white font-dm_sans w-full p-4">
      <Sidebar />

      {/* Main layout column */}
      <div className="flex flex-col flex-1 min-h-screen">
        {/* Header */}
        <div className="flex justify-end items-center px-6 py-2">
          <button
            onClick={onLogout}
            className="bg-purple-900 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Outlet />
        </div>

        {/* Footer inside right layout column */}
        <Footer />
      </div>
    </div>
  );
};

export default ProtectedLayout;
