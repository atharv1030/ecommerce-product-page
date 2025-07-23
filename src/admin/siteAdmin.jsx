// /admin/siteAdmin.jsx
import React from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { Outlet } from "react-router-dom";

const SiteAdmin = () => {
  return (
    <div className="w-full h-screen flex bg-[#F5EEDD] text-[#06202B]">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 bg-[#ffffff] dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SiteAdmin;
