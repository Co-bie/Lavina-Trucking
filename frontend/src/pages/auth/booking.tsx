import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import AuthLayout from "@/components/shared/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trucksAPI } from "@/services/api";
import type { Truck } from "@/types/type";
import { useBookingStore } from "@/stores/use-booking-store";

export default function Booking() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [selectedTruck, setSelectedTruck] = useState("");
  const [receipt, setReceipt] = useState<string | null>(null);
  const [location, setLocation] = useLocation();
  const setBooking = useBookingStore((state) => state.setBooking);

  const fetchTrucks = async () => {
    try {
      const response = await trucksAPI.getTrucks();
      if (response.data.success) {
        setTrucks(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching trucks:", error);
    }
  };

  useEffect(() => {
    fetchTrucks();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setReceipt(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const contact = formData.get("contact") as string;
    const trips = Number(formData.get("trips"));
    const departure = formData.get("departure") as string;
    const destination = formData.get("destination") as string;
    const date = formData.get("date") as string;

    if (
      !name ||
      !contact ||
      !trips ||
      !departure ||
      !destination ||
      !date ||
      !selectedTruck
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setBooking({
      name,
      contact,
      trips,
      departure,
      destination,
      date,
      truck: selectedTruck,
      receipt,
    });
    setLocation("/payments");
  };

  return (
    <AuthLayout title="Book Your Trips">
      <div className="flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-4xl relative">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-2 gap-4 max-w-2xl"
          >
            <div className="flex flex-col space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="contact">Contact No.</Label>
              <Input id="contact" name="contact" required />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="trips">No. of trips</Label>
              <Input id="trips" name="trips" type="number" min="1" required />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="departure">Departure point</Label>
              <Input id="departure" name="departure" required />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" name="destination" required />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="date">Date of trip</Label>
              <Input id="date" name="date" type="date" required />
            </div>

            <div className="flex flex-col space-y-2">
              <Label>Trucks</Label>
              <Select onValueChange={(val) => setSelectedTruck(val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a truck" />
                </SelectTrigger>
                <SelectContent>
                  {trucks.map((truck) => (
                    <SelectItem key={truck.id} value={truck.model}>
                      {truck.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="receipt">Upload Receipt (optional)</Label>
              <Input
                id="receipt"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {receipt && (
                <img
                  src={receipt}
                  alt="Uploaded Receipt"
                  className="w-32 h-32 object-cover rounded-md mt-2 border"
                />
              )}
            </div>

            <div className="flex items-center justify-center col-span-2 mt-4">
              <Button type="submit" className="w-full">
                Save & Continue to Payment
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
