import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Truck as TruckIcon,
  Eye,
  Plus,
  Edit,
  Trash2,
  EyeOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import AuthLayout from "@/components/shared/auth-layout";
import { trucksAPI } from "@/services/api";
import { useAuth } from "@/contexts/auth-context";
import type { Truck, CreateTruckData } from "@/types/type";
import { cn } from "@/lib/utils";

export default function Trucks() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [filteredTrucks, setFilteredTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUnavailable, setShowUnavailable] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTruck, setEditingTruck] = useState<Truck | null>(null);
  const { user } = useAuth();
  const isAdmin = user?.user_type === "admin";

  const [formData, setFormData] = useState<CreateTruckData>({
    truck_number: "",
    model: "",
    plate_number: "",
    color: "",
    year: new Date().getFullYear(),
    status: "active",
    is_available: true,
    mileage: 0,
    notes: "",
  });

  useEffect(() => {
    fetchTrucks();
  }, []);

  useEffect(() => {
    if (showUnavailable) {
      setFilteredTrucks(trucks);
    } else {
      setFilteredTrucks(trucks.filter((truck) => truck.is_available));
    }
  }, [trucks, showUnavailable]);

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

  const handleCreateTruck = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await trucksAPI.createTruck(formData);
      if (response.data.success) {
        setTrucks([...trucks, response.data.data]);
        setIsCreateDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error creating truck:", error);
    }
  };

  const handleEditTruck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTruck) return;

    try {
      console.log("Updating truck:", editingTruck.id, "with data:", formData);
      const response = await trucksAPI.updateTruck(editingTruck.id, formData);
      console.log("Update response:", response);
      if (response.data.success) {
        setTrucks(
          trucks.map((truck) =>
            truck.id === editingTruck.id ? response.data.data : truck
          )
        );
        setIsEditDialogOpen(false);
        setEditingTruck(null);
        resetForm();
      } else {
        console.error("Update failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating truck:", error);
      if (typeof error === "object" && error !== null && "response" in error) {
        console.error("Error response:", error);
      }
    }
  };

  const handleDeleteTruck = async (id: number) => {
    if (!confirm("Are you sure you want to delete this truck?")) return;

    try {
      const response = await trucksAPI.deleteTruck(id);
      if (response.data.success) {
        setTrucks(trucks.filter((truck) => truck.id !== id));
      }
    } catch (error) {
      console.error("Error deleting truck:", error);
    }
  };

  const handleToggleAvailability = async (
    id: number,
    currentAvailability: boolean
  ) => {
    try {
      console.log(
        "Toggling availability for truck:",
        id,
        "from",
        currentAvailability,
        "to",
        !currentAvailability
      );
      const response = await trucksAPI.toggleAvailability(
        id,
        !currentAvailability
      );
      console.log("Toggle response:", response);
      if (response.data.success) {
        setTrucks(
          trucks.map((truck) =>
            truck.id === id
              ? { ...truck, is_available: !currentAvailability }
              : truck
          )
        );
      } else {
        console.error("Toggle failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error toggling availability:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
      }
      if (typeof error === "object" && error !== null && "response" in error) {
        console.error("Error response:", error);
      }
    }
  };

  const openEditDialog = (truck: Truck) => {
    setEditingTruck(truck);
    setFormData({
      truck_number: truck.truck_number,
      model: truck.model,
      plate_number: truck.plate_number,
      color: truck.color || "",
      year: truck.year || new Date().getFullYear(),
      status: truck.status,
      is_available: truck.is_available,
      mileage: truck.mileage || 0,
      notes: truck.notes || "",
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      truck_number: "",
      model: "",
      plate_number: "",
      color: "",
      year: new Date().getFullYear(),
      status: "active",
      is_available: true,
      mileage: 0,
      notes: "",
    });
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Fleet Management
            </h1>
            <p className="text-gray-600">Manage and monitor your truck fleet</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={showUnavailable}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setShowUnavailable(e.target.checked)
                }
              />
              <span className="text-sm text-gray-700">
                Show Unavailable Trucks
              </span>
              {!showUnavailable && <EyeOff className="h-4 w-4 text-gray-500" />}
            </div>

            <div className="flex items-center gap-2">
              <TruckIcon className="h-5 w-5 text-[#1e786c]" />
              <span className="text-sm font-medium text-gray-700">
                {filteredTrucks.length} of {trucks.length} Trucks
              </span>
            </div>

            {isAdmin && (
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-[#1e786c] hover:bg-[#cfab3d] text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Truck
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md bg-white">
                  <DialogHeader>
                    <DialogTitle>Add New Truck</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateTruck} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="truck_number">Truck Number *</Label>
                        <Input
                          id="truck_number"
                          value={formData.truck_number}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              truck_number: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="plate_number">Plate Number *</Label>
                        <Input
                          id="plate_number"
                          value={formData.plate_number}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              plate_number: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="model">Model *</Label>
                      <Input
                        id="model"
                        value={formData.model}
                        onChange={(e) =>
                          setFormData({ ...formData, model: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="color">Color</Label>
                        <Input
                          id="color"
                          value={formData.color}
                          onChange={(e) =>
                            setFormData({ ...formData, color: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="year">Year</Label>
                        <Input
                          id="year"
                          type="number"
                          min="1990"
                          max={new Date().getFullYear() + 1}
                          value={formData.year}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              year: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value: string) =>
                            setFormData({
                              ...formData,
                              status: value as
                                | "active"
                                | "maintenance"
                                | "inactive",
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="maintenance">
                              Maintenance
                            </SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="mileage">Mileage</Label>
                        <Input
                          id="mileage"
                          type="number"
                          min="0"
                          value={formData.mileage}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              mileage: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.is_available}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({
                            ...formData,
                            is_available: e.target.checked,
                          })
                        }
                      />
                      <Label>Available for trips</Label>
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button
                        type="submit"
                        className="flex-1 bg-[#1e786c] hover:bg-[#cfab3d]"
                      >
                        Create Truck
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {filteredTrucks.length === 0 ? (
          <div className="text-center py-12">
            <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {trucks.length === 0 ? "No Trucks Found" : "No Available Trucks"}
            </h3>
            <p className="text-gray-600">
              {trucks.length === 0
                ? "There are no trucks in your fleet yet."
                : "All trucks are currently unavailable. Toggle to show unavailable trucks."}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white shadow rounded-md overflow-hidden space-y-2">
              {filteredTrucks.map((truck) => (
                <div
                  key={truck.id}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 border",
                    !truck.is_available && "bg-gray-50 opacity-80"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <TruckIcon className="h-5 w-5 text-[#1e786c]" />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {truck.truck_number}{" "}
                        {!truck.is_available && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Unavailable
                          </Badge>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        {truck.model} • {truck.plate_number}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <>
                        <Switch
                          checked={truck.is_available}
                          onChange={() =>
                            handleToggleAvailability(
                              truck.id,
                              truck.is_available
                            )
                          }
                          className={cn(
                            truck.is_available
                              ? "data-[state=checked]:bg-green-600"
                              : "data-[state=unchecked]:bg-red-600"
                          )}
                        />

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(truck)}
                          className="border-[#cfab3d] text-[#cfab3d] hover:bg-[#cfab3d] hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteTruck(truck.id)}
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}

                    <Link href={`/trucks/${truck.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#1e786c] text-[#1e786c] hover:bg-[#1e786c] hover:text-white"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {isAdmin && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-md bg-white">
              <DialogHeader>
                <DialogTitle>Edit Truck</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditTruck} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_truck_number">Truck Number *</Label>
                    <Input
                      id="edit_truck_number"
                      value={formData.truck_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          truck_number: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_plate_number">Plate Number *</Label>
                    <Input
                      id="edit_plate_number"
                      value={formData.plate_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          plate_number: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit_model">Model *</Label>
                  <Input
                    id="edit_model"
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_color">Color</Label>
                    <Input
                      id="edit_color"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_year">Year</Label>
                    <Input
                      id="edit_year"
                      type="number"
                      min="1990"
                      max={new Date().getFullYear() + 1}
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          year: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit_mileage">Mileage</Label>
                  <Input
                    id="edit_mileage"
                    type="number"
                    min="0"
                    value={formData.mileage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mileage: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit_notes">Notes</Label>
                  <Textarea
                    id="edit_notes"
                    value={formData.notes}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-[#1e786c] hover:bg-[#cfab3d]"
                  >
                    Update Truck
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditDialogOpen(false);
                      setEditingTruck(null);
                      resetForm();
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AuthLayout>
  );
}
