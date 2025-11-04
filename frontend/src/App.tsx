import "./App.css";
import { Route, Switch } from "wouter";
import { AuthProvider } from "./contexts/auth-context";
import RouteGuard from "./components/shared/route-guard";

import { Login } from "./pages/public/login";
import { Signup } from "./pages/public/signup";
import LandingPage from "./pages/public/landing-page";
import TrackingPage from "./pages/public/trackings";

import Home from "./pages/auth/dashboard";
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
import RateTheDriver from "./pages/auth/rate-the-driver";
import MaintenanceHistoryPage from "./pages/auth/maintenace-history";

function App() {
  return (
    <AuthProvider>
      <Switch>
        <Route
          path="/"
          component={() => <RouteGuard component={LandingPage} />}
        />
        <Route
          path="/login"
          component={() => <RouteGuard component={Login} />}
        />
        <Route
          path="/register"
          component={() => <RouteGuard component={Signup} />}
        />
        <Route path="/trackings/:id">
          {(params) => <TrackingPage params={params} />}
        </Route>

        <Route
          path="/dashboard"
          component={() => <RouteGuard protected component={Home} />}
        />
        <Route
          path="/fuel-logs"
          component={() => <RouteGuard protected component={FuelLogsPage} />}
        />
        <Route
          path="/payments"
          component={() => <RouteGuard protected component={PaymentsPage} />}
        />
        <Route
          path="/trip-logs"
          component={() => <RouteGuard protected component={TripLogsPage} />}
        />
        <Route
          path="/user-management"
          component={() => <RouteGuard protected component={UserManagement} />}
        />
        <Route
          path="/profile"
          component={() => <RouteGuard protected component={ProfilePage} />}
        />
        <Route
          path="/drivers"
          component={() => <RouteGuard protected component={Drivers} />}
        />
        <Route
          path="/trucks"
          component={() => <RouteGuard protected component={Trucks} />}
        />
        <Route
          path="/booking"
          component={() => <RouteGuard protected component={Booking} />}
        />
        <Route
          path="/bookings"
          component={() => <RouteGuard protected component={Bookings} />}
        />
        <Route
          path="/schedules"
          component={() => <RouteGuard protected component={Schedules} />}
        />
        <Route
          path="/transaction-history"
          component={() => (
            <RouteGuard protected component={TransactionHistoryPage} />
          )}
        />
        <Route
          path="/maintenance-history"
          component={() => (
            <RouteGuard protected component={MaintenanceHistoryPage} />
          )}
        />
        <Route path="/driver/:id">
          {(params) => (
            <RouteGuard
              protected
              component={() => <DriverProfile params={params} />}
            />
          )}
        </Route>
        <Route path="/rate-the-driver/:id">
          {(params) => (
            <RouteGuard
              protected
              component={() => <RateTheDriver params={params} />}
            />
          )}
        </Route>
        <Route path="/receipt/:id">
          {(params) => (
            <RouteGuard
              protected
              component={() => <ReceiptPage params={params} />}
            />
          )}
        </Route>

        <Route>
          <h1 className="text-center text-2xl mt-10">404 - Page Not Found</h1>
        </Route>
      </Switch>
    </AuthProvider>
  );
}

export default App;
