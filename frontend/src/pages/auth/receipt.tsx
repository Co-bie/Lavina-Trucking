"use client";

import AuthLayout from "@/components/shared/auth-layout";
import { useBookingStore } from "@/stores/use-booking-store";
import { usePaymentStore } from "@/stores/use-payment-store";

type ReceiptPageProps = {
  params: { id: string };
};

export default function ReceiptPage({ params }: ReceiptPageProps) {
  const { booking } = useBookingStore();
  const { paymentMethod, receipt } = usePaymentStore();

  if (!booking) {
    return (
      <AuthLayout title="Booking Not Found">
        <div className="p-8 text-center text-gray-500">
          No booking data found. Please go back and complete your booking.
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Thank you for booking with us!">
      <div className="px-8 py-10 flex flex-col gap-6">
        <div className="flex justify-between border p-6 rounded-lg">
          <div className="flex-1 pr-10 border-r">
            <h2 className="font-semibold mb-4">Booking details</h2>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <p className="font-medium">Name:</p>
              <p>{booking.name}</p>

              <p className="font-medium">Contact No.:</p>
              <p>{booking.contact}</p>

              <p className="font-medium">Date:</p>
              <p>{booking.date}</p>

              <p className="font-medium">Departure point:</p>
              <p>{booking.departure}</p>

              <p className="font-medium">Destination:</p>
              <p>{booking.destination}</p>

              <p className="font-medium">Truck:</p>
              <p>{booking.truck}</p>

              <p className="font-medium">No. of Trips:</p>
              <p>{booking.trips}</p>
            </div>
          </div>

          <div className="flex-1 pl-10">
            <h2 className="font-semibold mb-4">Payment method</h2>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <p className="font-medium">(Cash/Gcash):</p>
              <p className="capitalize">{paymentMethod || "N/A"}</p>

              {paymentMethod === "g_cash" && (
                <>
                  <p className="font-medium">Gcash Ref No.:</p>
                  <p>{booking.receipt ? "Attached" : "Not uploaded"}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-4 border-t pt-4">
          <p className="text-lg font-medium">Total</p>
          <p className="text-lg font-semibold">xxx</p>
        </div>
      </div>
    </AuthLayout>
  );
}
