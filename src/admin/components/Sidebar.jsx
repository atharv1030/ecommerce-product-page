// /admin/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, Users } from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Products", path: "/admin/products", icon: <Package size={20} /> },
    { name: "Users", path: "/admin/users", icon: <Users size={20} /> },
  ];

  return (
    <div className="w-64 bg-[#7AE2CF] text-[#06202B] h-screen shadow-xl flex flex-col">
      <div className="text-3xl font-bold p-6 text-center tracking-wide border-b border-[#F5EEDD]">
        NexusMart
      </div>

      <nav className="flex flex-col mt-6 gap-2 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg text-lg transition-all duration-200 
              ${isActive ? "bg-[#F5EEDD] text-[#06202B] font-semibold" : "hover:bg-[#077A7D] hover:text-white"}`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-4 text-sm text-[#F5EEDD] text-center">
        © 2025 NexusMart Admin
      </div>
    </div>
  );
};

export default Sidebar;
