import { useState } from "react";
import { useLocation } from "wouter";
import { Truck, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

interface SidebarItem {
  name: string;
  path: string;
  adminOnly?: boolean;
}

export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();

  const navItems: SidebarItem[] = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "User Management",
      path: "/user-management",
      adminOnly: true,
    },
    {
      name: "Drivers",
      path: "/drivers",
    },
    {
      name: "Trucks",
      path: "/trucks",
    },
    {
      name: "Schedules",
      path: "/schedules",
    },
    {
      name: "Profile",
      path: "/profile",
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly && user?.user_type !== 'admin') {
      return false;
    }
    return true;
  });

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
        {filteredNavItems.map((item) => (
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
            {!isCollapsed && <span>{item.name}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
}
