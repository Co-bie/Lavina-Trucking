import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import {
  Search,
  ArrowUpDown,
  MoreHorizontal,
  Truck,
  MapPin,
  UserIcon,
  Phone,
  Mail,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AuthLayout from "@/components/shared/auth-layout";
import { driversAPI } from "@/services/api";
import type { User } from "@/types/type";

export default function Drivers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [drivers, setDrivers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await driversAPI.getDrivers();
      if (response.data.success) {
        setDrivers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching drivers:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortedDrivers = useMemo(() => {
    return [...drivers].sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "email":
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case "location":
          aValue = `${a.city || ''}, ${a.state || ''}`.toLowerCase();
          bValue = `${b.city || ''}, ${b.state || ''}`.toLowerCase();
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
  }, [drivers, sortField, sortDirection]);

  const filteredDrivers = useMemo(() => {
    return sortedDrivers.filter(
      (driver) =>
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (driver.phone && driver.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (driver.city && driver.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (driver.state && driver.state.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [sortedDrivers, searchTerm]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getStatusVariant = (isActive: boolean) => {
    return isActive ? "default" : "secondary";
  };

  const getStatusLabel = (isActive: boolean) => {
    return isActive ? "Active" : "Inactive";
  };

  if (loading) {
    return (
      <AuthLayout title="Drivers">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e786c] mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading drivers...</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Drivers">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredDrivers.length} driver{filteredDrivers.length !== 1 ? 's' : ''} found
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>
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
                    onClick={() => handleSort("email")}
                    className="p-0 hover:bg-transparent font-semibold"
                  >
                    Contact
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
                      <UserIcon className="h-12 w-12 opacity-50" />
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
                          <Avatar className="h-10 w-10">
                            <AvatarImage 
                              src={driver.profile_picture ? `http://localhost:8000/storage/profile_pictures/${driver.profile_picture}` : undefined} 
                              alt={driver.name} 
                            />
                            <AvatarFallback>
                              {driver.first_name?.[0] || driver.name[0]}{driver.last_name?.[0] || driver.name[1]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground group-hover:text-[#1e786c]">
                              {driver.name}
                            </span>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Truck className="h-3 w-3" />
                              License: {driver.license_number || 'Not provided'}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span>{driver.email}</span>
                        </div>
                        {driver.phone && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{driver.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>
                          {driver.address 
                            ? driver.address
                            : driver.city && driver.state 
                              ? `${driver.city}, ${driver.state}`
                              : driver.city || driver.state || 'Not specified'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(driver.is_active)}>
                        {getStatusLabel(driver.is_active)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
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
            Showing {filteredDrivers.length} of {drivers.length} drivers
            {searchTerm && ` for "${searchTerm}"`}
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
