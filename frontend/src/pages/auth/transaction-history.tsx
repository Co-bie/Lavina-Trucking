import { useState } from "react";
import AuthLayout from "@/components/shared/auth-layout";
import { mockTransactions } from "@/constants/mock-data";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TransactionHistoryPage() {
  const [search, setSearch] = useState("");

  const filteredData = mockTransactions.filter((t) => {
    const s = search.toLowerCase();
    return (
      t.client.name.toLowerCase().includes(s) ||
      t.client.phone.toLowerCase().includes(s) ||
      t.client.id.toLowerCase().includes(s) ||
      t.goods.item.toLowerCase().includes(s) ||
      t.driver.name.toLowerCase().includes(s) ||
      t.driver.truck_number.toLowerCase().includes(s)
    );
  });

  return (
    <AuthLayout title="Transaction History">
      <div className="flex items-center justify-center">
        <div className="max-w-8xl w-full p-6 bg-white rounded-lg shadow-md">
          <div className="mb-4">
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Trip</TableHead>
                <TableHead>Goods</TableHead>
                <TableHead>Driver/Truck</TableHead>
                <TableHead>Fuel</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((t, idx) => (
                <TableRow key={idx}>
                  <TableCell className="whitespace-pre-line">
                    {t.client.name}
                    {"\n"}
                    {t.client.phone}
                    {"\n"}
                    {t.client.id}
                  </TableCell>

                  <TableCell className="whitespace-pre-line">
                    <span className="font-semibold">Departure Point:</span>{" "}
                    {t.trip.departure.point} | {t.trip.departure.date}{" "}
                    {t.trip.departure.time}
                    {"\n"}
                    <span className="font-semibold">En Route:</span>{" "}
                    {t.trip.en_route.point} | {t.trip.en_route.date}{" "}
                    {t.trip.en_route.time}
                    {"\n"}
                    <span className="font-semibold">Destination:</span>{" "}
                    {t.trip.destination.point} | {t.trip.destination.date}{" "}
                    {t.trip.destination.time}
                    {"\n"}
                    <span className="italic">
                      Travel time: {t.trip.travel_time_hours} hour Trip
                    </span>
                  </TableCell>

                  <TableCell>
                    {t.goods.item} {t.goods.weight}
                    {t.goods.unit}
                  </TableCell>

                  <TableCell className="whitespace-pre-line">
                    {t.driver.name}
                    {"\n"}
                    {t.driver.id}
                    {"\n"}
                    {t.driver.truck_number}
                  </TableCell>

                  <TableCell className="whitespace-pre-line">
                    {t.fuel.before} to {t.fuel.after}
                    {"\n"}
                    <span className="underline">Before</span>
                    {"\n"}
                    <span className="underline">After</span>
                  </TableCell>

                  <TableCell className="whitespace-pre-line">
                    {t.total.currency}
                    {t.total.amount} {t.total.payment_method}
                    {"\n"}
                    {t.total.remarks}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AuthLayout>
  );
}
