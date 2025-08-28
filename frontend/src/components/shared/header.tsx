import { useAuth } from "@/contexts/auth-context";
import { Button } from "../ui/button";
import { useLocation } from "wouter";
import { LogOut } from "lucide-react";

export default function Header() {
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
    <header className="bg-gradient-to-r from-[#d2f4f0] to-[#b0e0db] shadow-md px-6 py-4 flex items-center justify-between">
      <div
        className="text-xl font-bold cursor-pointer"
        onClick={() => setLocation("/dashboard")}
      >
        Task Manager
      </div>

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
    </header>
  );
}
