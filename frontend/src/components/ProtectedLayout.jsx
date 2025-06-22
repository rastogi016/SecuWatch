// components/ProtectedLayout.jsx
import React from "react";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  return (
    <div className="flex h-screen gradient-bg-main text-white font-dm_sans">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <Outlet /> {/* This will render the child route */}
      </div>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;
