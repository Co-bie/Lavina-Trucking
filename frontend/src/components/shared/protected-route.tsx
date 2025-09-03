<<<<<<< HEAD
import { Redirect } from "wouter";
=======
import { Redirect, useLocation } from "wouter";
>>>>>>> cc024f2abfab9c996eb85828c3eb46cc1f7a6b20
import { useAuth } from "../../contexts/auth-context";

interface ProtectedRouteProps {
  component: React.ComponentType;
}

export default function ProtectedRoute({
  component: Component,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
<<<<<<< HEAD
=======
  const [location] = useLocation();
>>>>>>> cc024f2abfab9c996eb85828c3eb46cc1f7a6b20

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (!user) {
<<<<<<< HEAD
=======
    // Store the current location before redirecting to login
    sessionStorage.setItem("redirectAfterLogin", location);
>>>>>>> cc024f2abfab9c996eb85828c3eb46cc1f7a6b20
    return <Redirect to="/login" />;
  }

  return <Component />;
}
