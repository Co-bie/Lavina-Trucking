<<<<<<< HEAD
import "./App.css";
=======
>>>>>>> cc024f2abfab9c996eb85828c3eb46cc1f7a6b20
import { Route, Switch } from "wouter";
import { Login } from "./pages/public/login";
import { AuthProvider } from "./contexts/auth-context";
import { Signup } from "./pages/public/signup";
<<<<<<< HEAD
import Home from "./pages/auth/dashboard";
import ProtectedRoute from "./components/shared/protected-route";
import LandingPage from "./pages/public/landing-page";
import ProfilePage from "./pages/auth/profile";
import Schedules from "./pages/auth/schedules";
=======
import Dashboard from "./pages/auth/dashboard";
import UserManagement from "./pages/auth/user-management";
import ProtectedRoute from "./components/shared/protected-route";
import LandingPage from "./pages/public/landing-page";

>>>>>>> cc024f2abfab9c996eb85828c3eb46cc1f7a6b20
function App() {
  return (
    <AuthProvider>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Signup} />
        <Route
          path="/dashboard"
<<<<<<< HEAD
          component={() => <ProtectedRoute component={Home} />}
        />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/schedules" component={Schedules} />
=======
          component={() => <ProtectedRoute component={Dashboard} />}
        />
        <Route
          path="/user-management"
          component={() => <ProtectedRoute component={UserManagement} />}
        />
>>>>>>> cc024f2abfab9c996eb85828c3eb46cc1f7a6b20
        <Route>
          <h1>404 - Page Not Found</h1>
        </Route>
      </Switch>
    </AuthProvider>
  );
}

export default App;
