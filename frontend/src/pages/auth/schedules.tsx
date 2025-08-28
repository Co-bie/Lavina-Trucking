import { useState } from "react";
import { MockData } from "@/constants/mock-data";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import AuthLayout from "@/components/shared/auth-layout";
export default function Schedules() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

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

  const dailyShipments = MockData.filter((schedule) =>
    isSameDay(new Date(schedule.date), selectedDate)
  );

  const daysWithShipments = MockData.filter((schedule) =>
    isSameMonth(new Date(schedule.date), currentMonth)
  ).map((schedule) => new Date(schedule.date).getDate());

  const DayWithShipments = ({ date }: { date: Date }) => {
    const hasShipments = daysWithShipments.includes(date.getDate());
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
        {hasShipments && (
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
          Shipment Schedule
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
              Shipments for {formatDisplayDate(selectedDate)}
            </h2>

            {dailyShipments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No shipments scheduled for this date
              </p>
            ) : (
              <div className="space-y-4">
                {dailyShipments.map((shipment) => (
                  <div
                    key={shipment.id}
                    className="border-l-4 border-[#cfab3d] pl-4 py-2"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-800">
                        {shipment.locations.departure_point} →{" "}
                        {shipment.locations.destination}
                      </h3>
                      <span className="text-sm bg-[#1e786c] bg-opacity-10 text-white px-2 py-1 rounded-full">
                        {shipment.time}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>
                        {shipment.goods.item} • {shipment.goods.weight_in_kgs}{" "}
                        kg
                      </p>
                      <p className="mt-1">Truck: {shipment.truck_number}</p>
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
