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
import Booking from "./pages/auth/booking";
import TransactionHistoryPage from "./pages/auth/transaction-history";
import FuelLogsPage from "./pages/auth/fuel-logs";
import TripLogsPage from "./pages/auth/trip-logs";
import PaymentsPage from "./pages/auth/payments";
import ReceiptPage from "./pages/auth/receipt";
import Bookings from "./pages/auth/bookings";
import TrackingPage from "./pages/public/trackings";
import RateTheDriver from "./pages/auth/rate-the-driver";
import MaintenanceHistoryPage from "./pages/auth/maintenace-history";
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
        <Route
          path="/fuel-logs"
          component={() => <ProtectedRoute component={FuelLogsPage} />}
        />
        <Route
          path="/fuel-logs"
          component={() => <ProtectedRoute component={FuelLogsPage} />}
        />
        <Route
          path="/payments"
          component={() => <ProtectedRoute component={PaymentsPage} />}
        />

        <Route
          path="/trip-logs"
          component={() => <ProtectedRoute component={TripLogsPage} />}
        />
        <Route
          path="/user-management"
          component={() => <ProtectedRoute component={UserManagement} />}
        />
        <Route path="/driver/:id">
          {(params) => (
            <ProtectedRoute
              component={() => <DriverProfile params={params} />}
            />
          )}
        </Route>
        <Route path="/rate-the-driver/:id">
          {(params) => (
            <ProtectedRoute
              component={() => <RateTheDriver params={params} />}
            />
          )}
        </Route>
        <Route path="/receipt/:id">
          {(params) => (
            <ProtectedRoute component={() => <ReceiptPage params={params} />} />
          )}
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
          path="/booking"
          component={() => <ProtectedRoute component={Booking} />}
        />
        <Route
          path="/bookings"
          component={() => <ProtectedRoute component={Bookings} />}
        />
        <Route
          path="/schedules"
          component={() => <ProtectedRoute component={Schedules} />}
        />
        <Route
          path="/transaction-history"
          component={() => (
            <ProtectedRoute component={TransactionHistoryPage} />
          )}
        />
        <Route
          path="/maintenance-history"
          component={() => (
            <ProtectedRoute component={MaintenanceHistoryPage} />
          )}
        />
        <Route path="/trackings/:id">
          {(params) => <TrackingPage params={params} />}
        </Route>
        <Route>
          <h1>404 - Page Not Found</h1>
        </Route>
      </Switch>
    </AuthProvider>
  );
}

export default App;
