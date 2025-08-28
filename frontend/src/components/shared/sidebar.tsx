import { useState } from "react";
import { useLocation } from "wouter";
import {
  Calendar,
  User,
  Truck,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems: SidebarItem[] = [
    {
      name: "Schedules",
      path: "/schedules",
      icon: <Calendar size={20} />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <User size={20} />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings size={20} />,
    },
  ];

  const handleNavigation = (path: string) => {
    setLocation(path);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div
      className={`h-screen bg-white shadow-lg flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-[#1e786c] flex items-center justify-center">
              <Truck size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-[#1e786c]">LogiTrack</span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 rounded-md bg-[#1e786c] flex items-center justify-center mx-auto">
            <Truck size={18} className="text-white" />
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            type="button"
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={`w-full flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors
              ${
                isActive(item.path)
                  ? "bg-[#1e786c] text-white"
                  : "text-gray-600 hover:bg-[#cfab3d] hover:bg-opacity-10 hover:text-[#1e786c]"
              }`}
          >
            <span
              className={`flex items-center justify-center ${
                isCollapsed ? "w-full" : "mr-3"
              }`}
            >
              {item.icon}
            </span>
            {!isCollapsed && <span>{item.name}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#cfab3d] flex items-center justify-center text-white text-xs font-bold">
                JD
              </div>
              <div className="text-xs">
                <p className="font-medium text-gray-800">John Doe</p>
                <p className="text-gray-500">Admin</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 rounded-full bg-[#cfab3d] flex items-center justify-center text-white text-xs font-bold">
              JD
            </div>
          )}
          <a
            href="/login"
            className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
            type="button"
          >
            <span className="sr-only">Log Out</span>
            <LogOut size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
