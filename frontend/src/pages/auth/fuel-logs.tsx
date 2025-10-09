import { useState } from "react";
import AuthLayout from "@/components/shared/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FuelLogsPage() {
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "before" | "after"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "before") setBeforeImage(file);
      else setAfterImage(file);
    }
  };

  return (
    <AuthLayout title="Fuel logs">
      <div className="flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-4xl relative">
          <form className="gap-4 max-w-2xl">
            <div className="mb-6">
              <Input placeholder="Booking ID" />
            </div>

            {/* Before Fuel Log */}
            <div className="flex items-center justify-between mb-5 gap-2">
              <Label>Before Fuel Log:</Label>
              <Input placeholder="Amount" className="w-1/2" />
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="before-image"
                  onChange={(e) => handleImageChange(e, "before")}
                />
                <Button
                  type="button"
                  onClick={() =>
                    document.getElementById("before-image")?.click()
                  }
                >
                  {beforeImage ? "Change Image" : "Upload Image"}
                </Button>
              </div>
            </div>

            {/* After Fuel Log */}
            <div className="flex items-center justify-between gap-2">
              <Label>After Fuel Log:</Label>
              <Input placeholder="Amount" className="w-1/2" />
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="after-image"
                  onChange={(e) => handleImageChange(e, "after")}
                />
                <Button
                  type="button"
                  onClick={() =>
                    document.getElementById("after-image")?.click()
                  }
                >
                  {afterImage ? "Change Image" : "Upload Image"}
                </Button>
              </div>
            </div>

            <div className="mt-6 flex gap-6">
              {beforeImage && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Before:</p>
                  <img
                    src={URL.createObjectURL(beforeImage)}
                    alt="Before Fuel"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
              {afterImage && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">After:</p>
                  <img
                    src={URL.createObjectURL(afterImage)}
                    alt="After Fuel"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>
            <div className="flex">
              <Button type="button" className="ml-auto">
                Submit Logs
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
