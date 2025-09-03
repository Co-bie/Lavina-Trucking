import { useState, useMemo, type SetStateAction } from "react";
import { Link } from "wouter";
import {
  Search,
  ArrowUpDown,
  MoreHorizontal,
  User,
  Truck,
  Star,
  MapPin,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import AuthLayout from "@/components/shared/auth-layout";
import { mockDrivers } from "@/constants/mock-data";

export default function Drivers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const sortedDrivers = useMemo(() => {
    return [...mockDrivers].sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "rating":
          aValue = a.ratings.overall;
          bValue = b.ratings.overall;
          break;
        case "location":
          aValue = `${a.location.city}, ${a.location.state}`.toLowerCase();
          bValue = `${b.location.city}, ${b.location.state}`.toLowerCase();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      } else {
        return sortDirection === "asc"
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      }
    });
  }, [sortField, sortDirection]);

  const filteredDrivers = useMemo(() => {
    return sortedDrivers.filter(
      (driver) =>
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.location.state.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedDrivers, searchTerm]);

  const handleSort = (field: SetStateAction<string>) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "available":
        return "success";
      case "on_delivery":
        return "warning";
      case "off_duty":
        return "destructive";
      case "break":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <AuthLayout title="Drivers">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort("name")}
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Sort
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("name")}
                    className="p-0 hover:bg-transparent font-semibold"
                  >
                    Driver
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("rating")}
                    className="p-0 hover:bg-transparent font-semibold"
                  >
                    Rating
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("location")}
                    className="p-0 hover:bg-transparent font-semibold"
                  >
                    Location
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrivers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <User className="h-12 w-12 opacity-50" />
                      <p>No drivers found</p>
                      {searchTerm && (
                        <Button
                          variant="outline"
                          onClick={() => setSearchTerm("")}
                        >
                          Clear search
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDrivers.map((driver) => (
                  <TableRow key={driver.id} className="group">
                    <TableCell>
                      <Link href={`/driver/${driver.id}`}>
                        <div className="flex items-center gap-3 cursor-pointer hover:underline">
                          <img
                            src={driver.profile_image || "/default-driver.jpg"}
                            alt={driver.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground group-hover:text-[#1e786c]">
                              {driver.name}
                            </span>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Truck className="h-3 w-3" />
                              {driver.vehicle.make} {driver.vehicle.model}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-[#cfab3d] fill-current" />
                        <span className="font-medium">
                          {driver.ratings.overall}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          ({driver.ratings.total_reviews})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {driver.location.city}, {driver.location.state}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusVariant(
                          driver.current_status ?? "outline"
                        )}
                        className="capitalize"
                      >
                        {driver.current_status?.replace("_", " ")}
                        {driver.isOnline && (
                          <span className="ml-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant={driver.isAvailable ? "outline" : "default"}
                          size="sm"
                          className="h-8 px-3"
                          onClick={() =>
                            console.log("Toggle block:", driver.id)
                          }
                        >
                          {driver.isAvailable ? "Block" : "Unblock"}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/driver/${driver.id}`}>
                                View Profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit Driver</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Delete Driver
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {filteredDrivers.length > 0 && (
          <div className="text-sm text-muted-foreground text-center">
            Showing {filteredDrivers.length} of {mockDrivers.length} drivers
            {searchTerm && ` for "${searchTerm}"`}
          </div>
        )}
      </div>
    </AuthLayout>
  );
}