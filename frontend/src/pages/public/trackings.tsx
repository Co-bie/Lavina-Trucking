import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { tripsAPI, type Trip } from "@/lib/api/trips";
import LandingPageHeader from "@/components/landing-page/header";
import { Loader2 } from "lucide-react";
import Footer from "@/components/landing-page/footer";

type DriverProfileProps = {
  params: { id: string };
};

export default function TrackingPage({ params }: DriverProfileProps) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await tripsAPI.getTrip(parseInt(params.id));
      if (response.success) {
        setTrip(response.data);
      }
      setLoading(false);
    };
    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-primary w-6 h-6 mr-2" />
        <span>Loading trip details...</span>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Trip not found.
      </div>
    );
  }

  return (
    <div className="bg-[#f9fafb] min-h-screen">
      <LandingPageHeader />

      <div className="max-w-4xl mx-auto mt-24 px-4 py-12">
        <Card className="shadow-md border border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">
                Trip Code: {trip.trip_code}
              </CardTitle>
              <Badge
                className={`${
                  trip.status === "in_progress"
                    ? "bg-yellow-500"
                    : trip.status === "completed"
                    ? "bg-green-600"
                    : "bg-gray-400"
                } text-white`}
              >
                {trip.status.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              {new Date(trip.trip_date).toDateString()}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <section>
              <h3 className="text-lg font-medium mb-2 text-[#1e786c]">
                Client Information
              </h3>
              <Separator className="mb-2" />
              <p>
                <strong>Name:</strong> {trip.client_name}
              </p>
              <p>
                <strong>Contact:</strong> {trip.client_contact}
              </p>
              <p>
                <strong>Email:</strong> {trip.client_email}
              </p>
            </section>

            <section>
              <h3 className="text-lg font-medium mb-2 text-[#1e786c]">
                Trip Details
              </h3>
              <Separator className="mb-2" />
              <p>
                <strong>Departure:</strong> {trip.departure_point}
              </p>
              <p>
                <strong>Destination:</strong> {trip.destination}
              </p>
              <p>
                <strong>Route Notes:</strong> {trip.route_notes}
              </p>
              <p>
                <strong>Goods:</strong> {trip.goods_description}
              </p>
              <p>
                <strong>Cargo Type:</strong> {trip.cargo_type}
              </p>
              <p>
                <strong>Weight:</strong> {trip.cargo_weight} kg
              </p>
              <p>
                <strong>Estimated Cost:</strong> Rs. {trip.estimated_cost}
              </p>
              <p>
                <strong>Actual Cost:</strong> Rs. {trip.actual_cost}
              </p>
              <p>
                <strong>Estimated Departure:</strong>{" "}
                {trip.estimated_departure_time}
              </p>
              <p>
                <strong>Estimated Arrival:</strong>{" "}
                {trip.estimated_arrival_time}
              </p>
              <p>
                <strong>Instructions:</strong> {trip.special_instructions}
              </p>
            </section>

            <section>
              <h3 className="text-lg font-medium mb-2 text-[#1e786c]">
                Truck Information
              </h3>
              <Separator className="mb-2" />
              <p>
                <strong>Truck Number:</strong> {trip.truck.truck_number}
              </p>
              <p>
                <strong>Model:</strong> {trip.truck.model}
              </p>
              <p>
                <strong>Plate Number:</strong> {trip.truck.plate_number}
              </p>
              <p>
                <strong>Color:</strong> {trip.truck.color}
              </p>
              <p>
                <strong>Year:</strong> {trip.truck.year}
              </p>
            </section>

            <section>
              <h3 className="text-lg font-medium mb-2 text-[#1e786c]">
                Driver Information
              </h3>
              <Separator className="mb-2" />
              <p>
                <strong>Name:</strong> {trip?.driver.name}
              </p>
              <p>
                <strong>Email:</strong> {trip?.driver.email}
              </p>
              <p>
                <strong>Status:</strong> {trip?.driver.employment_status}
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
