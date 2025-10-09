import { useState } from "react";
import AuthLayout from "@/components/shared/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TripLogsPage() {
  const [incidentFiles, setIncidentFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setIncidentFiles(files);
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
                <Input placeholder="Time" className="w-1/2" />
                <Input placeholder="Location" className="w-1/2" />
              </div>

              <div />

              <div className="flex items-center justify-between gap-4 col-span-2">
                <Label>En Route:</Label>
                <Input placeholder="Time" className="w-1/2" />
                <Input placeholder="Location" className="w-1/2" />
              </div>

              <div />

              <div className="flex items-center justify-between gap-4 col-span-2">
                <Label>Delivered:</Label>
                <Input placeholder="Time" className="w-1/2" />
                <Input placeholder="Location" className="w-1/2" />
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
