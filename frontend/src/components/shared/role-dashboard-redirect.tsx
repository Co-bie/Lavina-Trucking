import { Redirect } from "wouter";
import { useAuth } from "../../contexts/auth-context";

export default function RoleDashboardRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  // Redirect based on user role
  if (user.user_type === 'client') {
    return <Redirect to="/client-dashboard" />;
  } else {
    // Admin, driver, or other roles go to main dashboard
    return <Redirect to="/dashboard" />;
  }
}