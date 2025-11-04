import { Redirect } from "wouter";
import { useAuth } from "../../contexts/auth-context";

type RouteGuardProps = {
  component: React.ComponentType;
  protected?: boolean;
};

const PublicRoutes = ["/", "/login", "/register"];

export default function RouteGuard({
  component: Component,
  protected: isProtected = false,
}: RouteGuardProps) {
  const { user, loading } = useAuth();
  const currentPath = window.location.pathname;

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (user && PublicRoutes.includes(currentPath)) {
    return <Redirect to="/dashboard" />;
  }

  if (isProtected && !user) {
    return <Redirect to="/login" />;
  }

  return <Component />;
}
