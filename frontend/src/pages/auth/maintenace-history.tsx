import AuthLayout from "@/components/shared/auth-layout";
import { mockMaintenanceHistory } from "@/constants/mock-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MaintenanceHistoryPage() {
  return (
    <AuthLayout title="Maintenance History">
      <div className="max-w-6xl mx-auto mt-6">
        <Card className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Record ID</TableHead>
                <TableHead>Date Issued</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Truck Plate</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {mockMaintenanceHistory.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.id}</TableCell>
                  <TableCell>
                    {new Date(record.dateIssued).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{record.driverName}</p>
                      <p className="text-xs text-muted-foreground">
                        {record.driverCode}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{record.truckPlate}</TableCell>
                  <TableCell>{record.issue}</TableCell>
                  <TableCell className="text-right">
                    {record.currency}
                    {record.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        record.status === "Cleared"
                          ? "success"
                          : record.status === "Processing"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AuthLayout>
  );
}
