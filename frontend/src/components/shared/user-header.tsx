import { useAuth } from "@/contexts/auth-context";
import { Button } from "../ui/button";
import { useLocation } from "wouter";
import { LogOut, User, Bell, Circle, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockNotifications } from "@/constants/mock-data";
import { cn } from "@/lib/utils";

export default function UserHeader() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    try {
      logout();
      setLocation("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <header className="px-6 py-3 bg-[#1e786c] text-white">
      <div className="flex items-center justify-between">
        {/* Logo + Branding */}
        <div className="flex items-center gap-4">
          <img
            src="/logo.jpg"
            alt="Lavina Trucking"
            className="h-12 w-12 rounded"
          />
          <div>
            <h1 className="text-lg font-bold">Lavina Trucking</h1>
            <p className="text-sm text-green-100">Management System</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-2 rounded-full hover:bg-white/10 transition">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-80 p-0 bg-white text-gray-800 shadow-lg rounded-lg overflow-hidden"
            >
              <DropdownMenuLabel className="p-3 text-sm font-semibold border-b">
                Notifications
              </DropdownMenuLabel>
              {mockNotifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  No new notifications
                </div>
              ) : (
                <>
                  {mockNotifications.slice(0, 5).map((n) => (
                    <DropdownMenuItem
                      key={n.id}
                      className={cn(
                        "flex flex-col items-start gap-1 px-4 py-3 cursor-pointer transition hover:bg-gray-50",
                        !n.read && "bg-green-50"
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium text-sm">{n.title}</span>
                        {!n.read && (
                          <Circle className="h-2 w-2 text-green-600 fill-green-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {n.message}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-gray-400">
                        <Clock className="w-3 h-3" />
                        {new Date(n.createdAt).toLocaleString()}
                      </div>
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator />
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Info */}
          {user && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">{user.name || "User"}</span>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            className="border-white text-white hover:bg-white hover:text-[#1e786c] transition"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
