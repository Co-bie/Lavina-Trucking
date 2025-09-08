import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Truck as TruckIcon,
  Calendar,
  Gauge,
  Wrench,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/shared/auth-layout";
import { trucksAPI } from "@/services/api";
import type { Truck } from "@/types/type";

export default function Trucks() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrucks();
  }, []);

  const fetchTrucks = async () => {
    try {
      setLoading(true);
      const response = await trucksAPI.getTrucks();
      if (response.data.success) {
        setTrucks(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching trucks:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "maintenance":
        return <Wrench className="h-4 w-4 text-yellow-600" />;
      case "inactive":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default" as const;
      case "maintenance":
        return "secondary" as const;
      case "inactive":
        return "destructive" as const;
      default:
        return "outline" as const;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <AuthLayout title="Fleet Management">
        <div className="space-y-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e786c] mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading trucks...</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Fleet Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fleet Management</h1>
            <p className="text-gray-600">Manage and monitor your truck fleet</p>
          </div>
          <div className="flex items-center gap-2">
            <TruckIcon className="h-5 w-5 text-[#1e786c]" />
            <span className="text-sm font-medium text-gray-700">
              {trucks.length} Trucks Total
            </span>
          </div>
        </div>

        {/* Trucks Grid */}
        {trucks.length === 0 ? (
          <div className="text-center py-12">
            <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Trucks Found</h3>
            <p className="text-gray-600">There are no trucks in your fleet yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {trucks.map((truck) => (
              <Card key={truck.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <TruckIcon className="h-5 w-5 text-[#1e786c]" />
                      {truck.truck_number}
                    </CardTitle>
                    <Badge variant={getStatusVariant(truck.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(truck.status)}
                        {getStatusLabel(truck.status)}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Model
                      </label>
                      <p className="text-sm font-medium text-gray-900">{truck.model}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Plate Number
                      </label>
                      <p className="text-sm font-medium text-gray-900">{truck.plate_number}</p>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="grid grid-cols-2 gap-4">
                    {truck.color && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Color
                        </label>
                        <p className="text-sm text-gray-700">{truck.color}</p>
                      </div>
                    )}
                    {truck.year && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Year
                        </label>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <p className="text-sm text-gray-700">{truck.year}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mileage */}
                  {truck.mileage && (
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Mileage
                      </label>
                      <div className="flex items-center gap-1">
                        <Gauge className="h-3 w-3 text-gray-400" />
                        <p className="text-sm text-gray-700">
                          {truck.mileage.toLocaleString()} miles
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {truck.notes && (
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Notes
                      </label>
                      <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        {truck.notes}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 border-t">
                    <Link href={`/trucks/${truck.id}`}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-[#1e786c] text-[#1e786c] hover:bg-[#1e786c] hover:text-white"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
