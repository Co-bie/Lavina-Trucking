import { Redirect, useLocation } from "wouter";
import { useAuth } from "../../contexts/auth-context";

interface ProtectedRouteProps {
  component: React.ComponentType;
}

export default function ProtectedRoute({
  component: Component,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [location] = useLocation();

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (!user) {
    // Store the current location before redirecting to login
    sessionStorage.setItem("redirectAfterLogin", location);
    return <Redirect to="/login" />;
  }

  return <Component />;
}
