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
function App() {
  return (
    <AuthProvider>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Signup} />
        <Route
          path="/dashboard"
          component={() => <ProtectedRoute component={Home} />}
        />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/schedules" component={Schedules} />
        <Route>
          <h1>404 - Page Not Found</h1>
        </Route>
      </Switch>
    </AuthProvider>
  );
}

export default App;
