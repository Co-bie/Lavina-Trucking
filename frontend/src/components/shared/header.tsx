import { useAuth } from "@/contexts/auth-context";
import { Button } from "../ui/button";
import { useLocation } from "wouter";
import { LogOut, Home, Users, Truck, Calendar, User } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    try {
      logout();
      setLocation("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const navigationItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/user-management", label: "Users", icon: Users },
    { path: "/drivers", label: "Drivers", icon: User },
    { path: "/trucks", label: "Trucks", icon: Truck },
    { path: "/schedules", label: "Schedules", icon: Calendar },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <header className="bg-gradient-to-r from-[#d2f4f0] to-[#b0e0db] shadow-md px-6 py-4">
      <div className="flex items-center justify-between">
        <div
          className="text-xl font-bold cursor-pointer text-[#1e786c]"
          onClick={() => setLocation("/dashboard")}
        >
          Lavina Trucking
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location === item.path;
            return (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-[#1e786c] text-white"
                    : "text-[#1e786c] hover:bg-[#1e786c]/10"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm font-medium text-gray-700">
              Hi, {user.name || "User"}
            </span>
          )}
          <Button
            variant="outline"
            className="flex items-center gap-2 border-[#1e786c] text-[#1e786c] hover:bg-[#1e786c] hover:text-white transition"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden mt-4 flex flex-wrap gap-2">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location === item.path;
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition-colors ${
                isActive
                  ? "bg-[#1e786c] text-white"
                  : "text-[#1e786c] hover:bg-[#1e786c]/10"
              }`}
            >
              <IconComponent className="w-3 h-3" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
