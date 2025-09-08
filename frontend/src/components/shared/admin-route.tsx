import React from "react";
import { useAuth } from "@/contexts/auth-context";
import { useLocation } from "wouter";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthLayout from "./auth-layout";

interface AdminRouteProps {
  children: React.ReactNode;
  fallbackMessage?: string;
}

export default function AdminRoute({ 
  children, 
  fallbackMessage = "You don't have permission to access this area." 
}: AdminRouteProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Show access denied if not admin
  if (!user || user.user_type !== 'admin') {
    return (
      <AuthLayout title="Access Denied">
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            {fallbackMessage}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Only administrators can access this area. Please contact your system administrator if you need access.
          </p>
          <Button 
            onClick={() => setLocation('/dashboard')}
            className="bg-[#1e786c] hover:bg-[#1a6b60] text-white"
          >
            Return to Dashboard
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return <>{children}</>;
}
