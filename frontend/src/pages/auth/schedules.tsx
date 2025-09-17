import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import AuthLayout from "@/components/shared/auth-layout";
import { useAuth } from "@/contexts/auth-context";
import { tripsAPI, type Trip } from "@/lib/api/trips";
import { Badge } from "@/components/ui/badge";
export default function Schedules() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      if (user.user_type === 'admin') {
        loadAllTrips();
      } else if (user.user_type === 'driver') {
        loadDriverTrips();
      } else {
        setLoading(false);
      }
    }
  }, [user]);

  const loadAllTrips = async () => {
    try {
      setLoading(true);
      const response = await tripsAPI.getTrips();
      if (response.success) {
        setTrips(response.data);
      }
    } catch (error) {
      console.error('Failed to load all trips:', error);
      setError('Failed to load scheduled trips');
    } finally {
      setLoading(false);
    }
  };

  const loadDriverTrips = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const response = await tripsAPI.getDriverTrips(user.id);
      if (response.success) {
        setTrips(response.data);
      }
    } catch (error) {
      console.error('Failed to load driver trips:', error);
      setError('Failed to load your scheduled trips');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return formatDate(date1) === formatDate(date2);
  };

  const isSameMonth = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth()
    );
  };

  const formatDisplayDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  const formatMonth = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
    };
    return date.toLocaleDateString(undefined, options);
  };

  // Filter trips for the selected date
  const dailyTrips = trips.filter((trip) =>
    isSameDay(new Date(trip.trip_date), selectedDate)
  );

  // Get days that have trips in the current month
  const daysWithTrips = trips.filter((trip) =>
    isSameMonth(new Date(trip.trip_date), currentMonth)
  ).map((trip) => new Date(trip.trip_date).getDate());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const DayWithShipments = ({ date }: { date: Date }) => {
    const hasTrips = daysWithTrips.includes(date.getDate());
    const isSelected = isSameDay(date, selectedDate);
    const isCurrentMonth = isSameMonth(date, currentMonth);

    return (
      <div
        className={`relative h-10 w-10 flex items-center justify-center rounded-full cursor-pointer transition-colors
          ${isSelected ? "bg-[#1e786c] text-white" : ""}
          ${
            !isSelected && isCurrentMonth
              ? "hover:bg-[#cfab3d] hover:bg-opacity-20"
              : ""
          }
          ${!isCurrentMonth ? "text-gray-300" : ""}
        `}
        onClick={() => setSelectedDate(date)}
      >
        {date.getDate()}
        {hasTrips && (
          <span className="absolute top-0 right-0 h-2 w-2 bg-[#cfab3d] rounded-full"></span>
        )}
      </div>
    );
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  return (
    <AuthLayout title="Schedules">
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1e786c] mb-8">
          {user?.user_type === 'admin' ? 'All Trip Schedules' : 'My Trip Schedule'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <span className="sr-only">Chevron Left Icon</span>
                <ChevronLeftIcon className="h-5 w-5 text-[#1e786c]" />
              </button>

              <h2 className="text-xl font-semibold text-gray-800">
                {formatMonth(currentMonth)}
              </h2>

              <button
                type="button"
                onClick={goToNextMonth}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <span className="sr-only">Chevron Right Icon</span>

                <ChevronRightIcon className="h-5 w-5 text-[#1e786c]" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center font-medium text-[#1e786c] py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {getDaysInMonth(currentMonth).map((date, index) => (
                <DayWithShipments key={index} date={date} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-[#1e786c] mb-4">
              Scheduled Trips for {formatDisplayDate(selectedDate)}
            </h2>

            {loading ? (
              <p className="text-gray-500 text-center py-8">
                Loading your scheduled trips...
              </p>
            ) : error ? (
              <p className="text-red-500 text-center py-8">
                {error}
              </p>
            ) : user?.user_type !== 'driver' && user?.user_type !== 'admin' ? (
              <p className="text-gray-500 text-center py-8">
                Trip schedules are only available for drivers and administrators
              </p>
            ) : dailyTrips.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No trips scheduled for this date
              </p>
            ) : (
              <div className="space-y-4">
                {dailyTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="border-l-4 border-[#cfab3d] pl-4 py-3 bg-gray-50 rounded-r-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-800">
                        {trip.departure_point} → {trip.destination}
                      </h3>
                      <div className="flex gap-2">
                        <Badge 
                          className={`text-xs ${getStatusColor(trip.status)}`}
                        >
                          {trip.status.toUpperCase()}
                        </Badge>
                        <span className="text-sm bg-[#1e786c] text-white px-2 py-1 rounded-full">
                          {trip.estimated_departure_time}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Trip Code:</strong> {trip.trip_code}</p>
                      <p><strong>Client:</strong> {trip.client_name}</p>
                      <p><strong>Contact:</strong> {trip.client_contact}</p>
                      <p><strong>Cargo:</strong> {trip.goods_description} • {trip.cargo_weight} tons</p>
                      {trip.truck && (
                        <p><strong>Truck:</strong> {trip.truck.truck_number} ({trip.truck.model})</p>
                      )}
                      {user?.user_type === 'admin' && trip.driver && (
                        <p><strong>Driver:</strong> {trip.driver.first_name} {trip.driver.last_name}</p>
                      )}
                      {user?.user_type === 'admin' && trip.driver?.phone && (
                        <p><strong>Driver Phone:</strong> {trip.driver.phone}</p>
                      )}
                      {user?.user_type === 'admin' && !trip.driver && (
                        <p className="text-amber-600"><strong>Driver:</strong> Not assigned</p>
                      )}
                      <p><strong>Estimated Arrival:</strong> {trip.estimated_arrival_time}</p>
                      {trip.special_instructions && (
                        <p className="italic text-orange-600">
                          <strong>Special Instructions:</strong> {trip.special_instructions}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

function getDaysInMonth(date: Date): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const days: Date[] = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(new Date(year, month, i - firstDay + 1));
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const totalCells = 42;
  const remaining = totalCells - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
}
