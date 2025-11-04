import { useState } from "react";
import AuthLayout from "@/components/shared/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function TripLogsPage() {
  const [incidentFiles, setIncidentFiles] = useState<File[]>([]);
  const [amPm, setAmPm] = useState({
    processing: "AM",
    enroute: "AM",
    delivered: "AM",
  });

  const locations = ["Jacinato", "Ulas", "Bangkal", "Agdao", "Puan", "Toril"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setIncidentFiles(files);
  };

  const toggleAmPm = (key: keyof typeof amPm) => {
    setAmPm((prev) => ({
      ...prev,
      [key]: prev[key] === "AM" ? "PM" : "AM",
    }));
  };

  return (
    <AuthLayout title="Trip Logs">
      <div className="flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-4xl relative">
          <form>
            <div className="grid grid-cols-3 gap-4 max-w-3xl mb-10">
              <div>
                <Input placeholder="Booking ID" />
              </div>

              <div className="flex items-center justify-between gap-4 col-span-2">
                <Label>Processing:</Label>
                <div className="flex items-center gap-2 w-1/2">
                  <Input placeholder="Time" />
                  <Button
                    type="button"
                    variant={amPm.processing === "AM" ? "secondary" : "default"}
                    size="sm"
                    className="w-14"
                    onClick={() => toggleAmPm("processing")}
                  >
                    {amPm.processing}
                  </Button>
                </div>
                <Select>
                  <SelectTrigger className="w-1/2">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div />

              <div className="flex items-center justify-between gap-4 col-span-2">
                <Label>En Route:</Label>
                <div className="flex items-center gap-2 w-1/2">
                  <Input placeholder="Time" />
                  <Button
                    type="button"
                    variant={amPm.enroute === "AM" ? "secondary" : "default"}
                    size="sm"
                    className="w-14"
                    onClick={() => toggleAmPm("enroute")}
                  >
                    {amPm.enroute}
                  </Button>
                </div>
                <Select>
                  <SelectTrigger className="w-1/2">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div />

              <div className="flex items-center justify-between gap-4 col-span-2">
                <Label>Delivered:</Label>
                <div className="flex items-center gap-2 w-1/2">
                  <Input placeholder="Time" />
                  <Button
                    type="button"
                    variant={amPm.delivered === "AM" ? "secondary" : "default"}
                    size="sm"
                    className="w-14"
                    onClick={() => toggleAmPm("delivered")}
                  >
                    {amPm.delivered}
                  </Button>
                </div>
                <Select>
                  <SelectTrigger className="w-1/2">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-2">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  multiple
                  id="incident-files"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="incident-files"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted transition-colors"
                >
                  {incidentFiles.length === 0 ? (
                    <p className="text-muted-foreground">
                      Click to upload Incident Report
                    </p>
                  ) : (
                    <div className="text-center">
                      <p className="font-medium mb-2">
                        {incidentFiles.length} file(s) selected
                      </p>
                      <ul className="text-sm text-muted-foreground max-h-20 overflow-y-auto">
                        {incidentFiles.map((file, idx) => (
                          <li key={idx}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </label>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-3 mt-auto">
                  <Button>Save</Button>
                  <Button variant="secondary">Submit</Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
