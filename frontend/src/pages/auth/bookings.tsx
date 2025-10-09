import AuthLayout from "@/components/shared/auth-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";

export default function Bookings() {
  const bookings = [
    {
      id: 1,
      receipt: "https://randomqr.com/assets/images/randomqr-256.png",
      amount: "₱1,500",
    },
    {
      id: 2,
      receipt: "https://randomqr.com/assets/images/randomqr-256.png",
      amount: "₱2,200",
    },
    {
      id: 3,
      receipt: "https://randomqr.com/assets/images/randomqr-256.png",
      amount: "₱3,000",
    },
  ];

  return (
    <AuthLayout title="Waiting Bookings">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-lg font-semibold mb-6">Confirmation Screen</h2>

        <div className="flex flex-col gap-4">
          {bookings.map((booking) => (
            <Card
              key={booking.id}
              className="flex items-center justify-between p-4"
            >
              <CardContent className="flex items-center gap-6 w-full p-0">
                <div className="flex flex-col gap-2 w-[200px]">
                  <Label>Booking ID</Label>
                  <p className="font-medium">
                    #{booking.id.toString().padStart(4, "0")}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Receipt</Label>
                  <img
                    src={booking.receipt}
                    alt="Receipt"
                    className="w-24 h-24 object-contain rounded-md border"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Amount</Label>
                  <p className="font-medium">{booking.amount}</p>
                </div>

                <div className="ml-auto">
                  <Button className="bg-emerald-700 hover:bg-emerald-800">
                    Confirm
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AuthLayout>
  );
}
