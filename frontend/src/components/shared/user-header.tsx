import { useAuth } from "@/contexts/auth-context";
import { Button } from "../ui/button";
import { useLocation } from "wouter";
import { LogOut, User } from "lucide-react";

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

  return (
    <header className="px-6 py-3 bg-[#1e786c] text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/logo.jpg" alt="Lavina Trucking" className="h-12 w-12 rounded" />
          <div>
            <h1 className="text-lg font-bold">Lavina Trucking</h1>
            <p className="text-sm text-green-100">Management System</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">
                {user.name || "User"}
              </span>
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
