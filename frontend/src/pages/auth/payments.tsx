import { useLocation } from "wouter";
import AuthLayout from "@/components/shared/auth-layout";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePaymentStore } from "@/stores/use-payment-store";

export default function PaymentsPage() {
  const [, setLocation] = useLocation();
  const { paymentMethod, setPaymentMethod, receipt, setReceipt } =
    usePaymentStore();

  const paymentMethods = [
    { value: "cash", label: "Cash" },
    { value: "g_cash", label: "Gcash" },
    { value: "bank_transfer", label: "Bank Transfer" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceipt(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => setReceipt(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentMethod || !receipt) {
      alert("Please select a payment method and upload your receipt first!");
      return;
    }

    // ✅ Navigate using wouter with state via query params or Zustand store
    setLocation("/receipt/1");
  };

  return (
    <AuthLayout title="Payments">
      <div className="flex items-center justify-center">
        <div className="max-w-8xl w-full">
          <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
            {/* LEFT SIDE */}
            <div className="w-full px-8 py-6 border rounded-lg flex items-center justify-center">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Payment Method:</Label>
                  <Select
                    value={paymentMethod || ""}
                    onValueChange={setPaymentMethod}
                  >
                    <SelectTrigger className="w-[300px]">
                      <SelectValue placeholder="Select Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="size-64 border flex items-center justify-center">
                  <img
                    src="https://randomqr.com/assets/images/randomqr-256.png"
                    loading="lazy"
                    width={150}
                    height={150}
                    alt="Payment QR code"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="px-8 py-6 border rounded-lg flex flex-col items-center justify-center">
              <div className="mb-4">
                <p className="font-medium text-lg">
                  Upload transfer receipt for confirmation
                </p>
              </div>

              {!receipt ? (
                <div className="size-96 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-3 text-center">
                  <Label
                    htmlFor="receipt-upload"
                    className="cursor-pointer text-sm text-muted-foreground hover:text-primary"
                  >
                    Click to upload receipt image
                  </Label>
                  <Input
                    id="receipt-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={receipt}
                    alt="Uploaded Receipt"
                    className="size-96 object-contain rounded-lg border"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRemove}
                    type="button"
                    className="absolute top-2 right-2"
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>

            <div />
            <div className="flex">
              <Button type="submit" className="ml-auto">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
