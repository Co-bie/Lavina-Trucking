import { Redirect } from "wouter";
import { useAuth } from "../../contexts/auth-context";

interface ProtectedRouteProps {
  component: React.ComponentType;
}

export default function ProtectedRoute({
  component: Component,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <Component />;
}
