import "./App.css";
import { Route, Switch } from "wouter";
import { Login } from "./pages/public/login";
import { AuthProvider } from "./contexts/auth-context";
import { Signup } from "./pages/public/signup";
import Home from "./pages/auth/dashboard";
import ProtectedRoute from "./components/shared/protected-route";
import LandingPage from "./pages/public/landing-page";
import ProfilePage from "./pages/auth/profile";
import Schedules from "./pages/auth/schedules";
import DriverProfile from "./pages/auth/driver-profile";
import Drivers from "./pages/auth/drivers";
import Trucks from "./pages/auth/trucks";
import UserManagement from "./pages/auth/user-management";
import ClientLanding from "./pages/auth/client-landing";
import RoleDashboardRedirect from "./components/shared/role-dashboard-redirect";
function App() {
  return (
    <AuthProvider>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Signup} />
        <Route path="/home" component={RoleDashboardRedirect} />
        <Route
          path="/dashboard"
          component={() => <ProtectedRoute component={Home} />}
        />
        <Route
          path="/client-dashboard"
          component={() => <ProtectedRoute component={ClientLanding} />}
        />
        <Route
          path="/user-management"
          component={() => <ProtectedRoute component={UserManagement} />}
        />
        <Route path="/driver/:id">
          {(params) => <ProtectedRoute component={() => <DriverProfile params={params} />} />}
        </Route>
        <Route
          path="/profile"
          component={() => <ProtectedRoute component={ProfilePage} />}
        />
        <Route
          path="/drivers"
          component={() => <ProtectedRoute component={Drivers} />}
        />
        <Route
          path="/trucks"
          component={() => <ProtectedRoute component={Trucks} />}
        />
        <Route
          path="/schedules"
          component={() => <ProtectedRoute component={Schedules} />}
        />
        <Route>
          <h1>404 - Page Not Found</h1>
        </Route>
      </Switch>
    </AuthProvider>
  );
}

export default App;
