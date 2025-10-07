import AuthLayout from "@/components/shared/auth-layout";
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
import { useEffect, useState } from "react";

export default function Booking() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
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
  return (
    <AuthLayout title="Book Your Trips">
      <div className="flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-4xl relative">
          <form className="grid grid-cols-2 gap-4 max-w-2xl">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="contact">Contact No.</Label>
              <Input id="contact" />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="trips">No. of trips</Label>
              <Input id="trips" type="number" />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="departure">Departure point</Label>
              <Input id="departure" />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="date">Date of trip</Label>
              <Input id="date" type="date" />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="date">Trucks</Label>
              <Select>
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
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
