import { Route, Switch } from "wouter";
import { Login } from "./pages/public/login";
import { AuthProvider } from "./contexts/auth-context";
import { Signup } from "./pages/public/signup";
import Dashboard from "./pages/auth/dashboard";
import UserManagement from "./pages/auth/user-management";
import ProtectedRoute from "./components/shared/protected-route";
import LandingPage from "./pages/public/landing-page";

function App() {
  return (
    <AuthProvider>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Signup} />
        <Route
          path="/dashboard"
          component={() => <ProtectedRoute component={Dashboard} />}
        />
        <Route
          path="/user-management"
          component={() => <ProtectedRoute component={UserManagement} />}
        />
        <Route>
          <h1>404 - Page Not Found</h1>
        </Route>
      </Switch>
    </AuthProvider>
  );
}

export default App;
