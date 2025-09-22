import { useState, useEffect } from "react";
import {
  Truck as TruckIcon,
  Calendar,
  Gauge,
  Plus,
  Edit,
  EyeOff,
  Power,
  PowerOff,
  ChevronDown,
  ChevronRight,
  Wrench,
  Clock,
  CheckCircle,
  AlertTriangle,
  List,
  Eye,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import AuthLayout from "@/components/shared/auth-layout";
import { trucksAPI, maintenanceAPI } from "@/services/api";
import { useAuth } from "@/contexts/auth-context";
import type { Truck, CreateTruckData, MaintenanceRecord, CreateMaintenanceData } from "@/types/type";

export default function Trucks() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [filteredTrucks, setFilteredTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUnavailable, setShowUnavailable] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTruck, setEditingTruck] = useState<Truck | null>(null);
  const [expandedTrucks, setExpandedTrucks] = useState<Set<number>>(new Set());
  
  // Maintenance-related state
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [isMaintenanceListOpen, setIsMaintenanceListOpen] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<MaintenanceRecord>>({});
  const [selectedTruckForMaintenance, setSelectedTruckForMaintenance] = useState<Truck | null>(null);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [maintenanceFormData, setMaintenanceFormData] = useState<CreateMaintenanceData>({
    truck_id: 0,
    maintenance_type: 'routine',
    description: '',
    scheduled_date: '',
    cost: 0,
    mileage_at_service: 0,
    service_provider: '',
    notes: ''
  });
  
  const { user } = useAuth();
  const isAdmin = user?.user_type === 'admin';

  const toggleExpanded = (truckId: number) => {
    const newExpanded = new Set(expandedTrucks);
    if (newExpanded.has(truckId)) {
      newExpanded.delete(truckId);
    } else {
      newExpanded.add(truckId);
    }
    setExpandedTrucks(newExpanded);
  };

  // Debug logging
  console.log('Current user:', user);
  console.log('Is admin:', isAdmin);

  // Form states
  const [formData, setFormData] = useState<CreateTruckData>({
    truck_number: '',
    model: '',
    plate_number: '',
    color: '',
    year: new Date().getFullYear(),
    is_available: true,
    mileage: 0,
    notes: ''
  });

  useEffect(() => {
    fetchTrucks();
    loadMaintenanceRecords();
  }, []);

  useEffect(() => {
    // Filter trucks based on availability toggle
    if (showUnavailable) {
      setFilteredTrucks(trucks);
    } else {
      setFilteredTrucks(trucks.filter(truck => truck.is_available));
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

  // Load maintenance records from API
  const loadMaintenanceRecords = async () => {
    try {
      const response = await maintenanceAPI.getMaintenanceRecords();
      if (response.data.success) {
        setMaintenanceRecords(response.data.data);
      }
    } catch (error) {
      console.error("Error loading maintenance records:", error);
      // Fallback to sample data if API fails
      const sampleRecords: MaintenanceRecord[] = [
        {
          id: 1,
          truck_id: 1,
          maintenance_type: 'routine',
          description: 'Regular oil change and filter replacement',
          scheduled_date: '2025-09-25T09:00:00',
          completed_date: '2025-09-25T10:30:00',
          status: 'completed',
          cost: 2500,
          mileage_at_service: 45000,
          service_provider: 'AutoCare Services',
          notes: 'All filters replaced, oil changed to synthetic blend',
          created_at: '2025-09-20T08:00:00',
          updated_at: '2025-09-25T10:30:00'
        },
        {
          id: 2,
          truck_id: 2,
          maintenance_type: 'repair',
          description: 'Brake pad replacement and brake system check',
          scheduled_date: '2025-09-28T14:00:00',
          status: 'scheduled',
          cost: 8500,
          mileage_at_service: 52000,
          service_provider: 'Heavy Duty Repairs',
          notes: 'Front and rear brake pads need replacement',
          created_at: '2025-09-21T10:00:00',
          updated_at: '2025-09-21T10:00:00'
        },
        {
          id: 3,
          truck_id: 1,
          maintenance_type: 'inspection',
          description: 'Annual safety inspection and emissions test',
          scheduled_date: '2025-10-15T08:00:00',
          status: 'scheduled',
          cost: 1500,
          service_provider: 'Government Inspection Center',
          notes: 'Required annual inspection for license renewal',
          created_at: '2025-09-15T09:00:00',
          updated_at: '2025-09-15T09:00:00'
        },
        {
          id: 4,
          truck_id: 3,
          maintenance_type: 'emergency',
          description: 'Engine overheating issue - coolant system repair',
          scheduled_date: '2025-09-22T16:00:00',
          status: 'in_progress',
          cost: 15000,
          mileage_at_service: 38000,
          service_provider: 'Emergency Truck Repair',
          notes: 'Radiator replacement required, coolant leak detected',
          created_at: '2025-09-22T15:30:00',
          updated_at: '2025-09-22T16:00:00'
        }
      ];
      setMaintenanceRecords(sampleRecords);
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
      console.log('Updating truck:', editingTruck.id, 'with data:', formData);
      const response = await trucksAPI.updateTruck(editingTruck.id, formData);
      console.log('Update response:', response);
      if (response.data.success) {
        setTrucks(trucks.map(truck => 
          truck.id === editingTruck.id ? response.data.data : truck
        ));
        setIsEditDialogOpen(false);
        setEditingTruck(null);
        resetForm();
      } else {
        console.error('Update failed:', response.data.message);
      }
    } catch (error) {
      console.error("Error updating truck:", error);
      if (typeof error === 'object' && error !== null && 'response' in error) {
        console.error('Error response:', (error as any).response?.data);
      }
    }
  };

  const handleToggleAvailability = async (id: number, currentAvailability: boolean) => {
    try {
      console.log('Toggling availability for truck:', id, 'from', currentAvailability, 'to', !currentAvailability);
      const response = await trucksAPI.toggleAvailability(id, !currentAvailability);
      console.log('Toggle response:', response);
      if (response.data.success) {
        setTrucks(trucks.map(truck => 
          truck.id === id ? { ...truck, is_available: !currentAvailability } : truck
        ));
      } else {
        console.error('Toggle failed:', response.data.message);
      }
    } catch (error) {
      console.error("Error toggling availability:", error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
      if (typeof error === 'object' && error !== null && 'response' in error) {
        console.error('Error response:', (error as any).response?.data);
      }
    }
  };

  const openEditDialog = (truck: Truck) => {
    setEditingTruck(truck);
    setFormData({
      truck_number: truck.truck_number,
      model: truck.model,
      plate_number: truck.plate_number,
      color: truck.color || '',
      year: truck.year || new Date().getFullYear(),
      is_available: truck.is_available,
      mileage: truck.mileage || 0,
      notes: truck.notes || ''
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      truck_number: '',
      model: '',
      plate_number: '',
      color: '',
      year: new Date().getFullYear(),
      is_available: true,
      mileage: 0,
      notes: ''
    });
  };

  // Maintenance-related functions
  const openMaintenanceDialog = (truck: Truck) => {
    setSelectedTruckForMaintenance(truck);
    setMaintenanceFormData({
      truck_id: truck.id,
      maintenance_type: 'routine',
      description: '',
      scheduled_date: '',
      cost: 0,
      mileage_at_service: truck.mileage || 0,
      service_provider: '',
      notes: ''
    });
    setIsMaintenanceDialogOpen(true);
  };

  const handleMaintenanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Clean the data before sending
      const cleanedData = {
        ...maintenanceFormData,
        cost: maintenanceFormData.cost || undefined,
        mileage_at_service: maintenanceFormData.mileage_at_service ? parseInt(maintenanceFormData.mileage_at_service.toString()) : undefined,
        service_provider: maintenanceFormData.service_provider || undefined,
        notes: maintenanceFormData.notes || undefined
      };
      
      console.log('Submitting maintenance data:', cleanedData);
      const response = await maintenanceAPI.createMaintenanceRecord(cleanedData);
      if (response.data.success) {
        alert('Maintenance scheduled successfully!');
        setIsMaintenanceDialogOpen(false);
        resetMaintenanceForm();
        // Reload maintenance records to show the new record
        loadMaintenanceRecords();
      } else {
        throw new Error(response.data.message || 'Failed to create maintenance record');
      }
    } catch (error: any) {
      console.error('Error creating maintenance record:', error);
      if (error.response?.status === 422) {
        // Validation errors
        console.error('Validation errors:', error.response.data);
        const errors = error.response.data.errors || {};
        const errorMessages = Object.entries(errors)
          .map(([field, messages]: [string, any]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
        alert(`Validation failed:\n${errorMessages}`);
      } else {
        alert('Failed to schedule maintenance');
      }
    }
  };

  const resetMaintenanceForm = () => {
    setMaintenanceFormData({
      truck_id: 0,
      maintenance_type: 'routine',
      description: '',
      scheduled_date: '',
      cost: 0,
      mileage_at_service: 0,
      service_provider: '',
      notes: ''
    });
    setSelectedTruckForMaintenance(null);
  };

  const handleStatusChange = async (recordId: number, newStatus: 'scheduled' | 'in_progress' | 'completed' | 'cancelled') => {
    try {
      const record = maintenanceRecords.find(r => r.id === recordId);
      if (!record) return;

      const updateData: any = {
        status: newStatus,
      };

      // Add completion date when status changes to completed
      if (newStatus === 'completed' && !record.completed_date) {
        updateData.completed_date = new Date().toISOString();
      }

      const response = await maintenanceAPI.updateMaintenanceRecord(recordId, updateData);
      if (response.data.success) {
        // Update local state with the updated record
        setMaintenanceRecords(prevRecords => 
          prevRecords.map(r => r.id === recordId ? response.data.data : r)
        );
      } else {
        throw new Error(response.data.message || 'Failed to update maintenance record');
      }
    } catch (error) {
      console.error('Error updating maintenance status:', error);
      alert('Failed to update maintenance status');
      // Reload maintenance records to revert any optimistic updates
      loadMaintenanceRecords();
    }
  };

  const startEditRecord = (record: MaintenanceRecord) => {
    setEditingRecordId(record.id);
    setEditFormData({
      description: record.description,
      cost: record.cost,
      service_provider: record.service_provider,
      notes: record.notes
    });
  };

  const saveEditRecord = () => {
    if (editingRecordId) {
      setMaintenanceRecords(prevRecords => 
        prevRecords.map(record => {
          if (record.id === editingRecordId) {
            return {
              ...record,
              ...editFormData,
              updated_at: new Date().toISOString()
            };
          }
          return record;
        })
      );
      setEditingRecordId(null);
      setEditFormData({});
    }
  };

  const cancelEditRecord = () => {
    setEditingRecordId(null);
    setEditFormData({});
  };

  const getMaintenanceStatusBadge = (truck: Truck) => {
    // Get maintenance records for this truck
    const truckMaintenanceRecords = maintenanceRecords.filter(record => record.truck_id === truck.id);
    
    if (truckMaintenanceRecords.length === 0) {
      return (
        <Badge variant="outline" className="text-xs">
          <Clock className="h-3 w-3 mr-1" />
          No maintenance
        </Badge>
      );
    }

    // Check for overdue or pending maintenance
    const overdueRecords = truckMaintenanceRecords.filter(record => {
      if (record.status === 'scheduled') {
        const scheduledDate = new Date(record.scheduled_date);
        return scheduledDate < new Date();
      }
      return false;
    });

    const inProgressRecords = truckMaintenanceRecords.filter(record => record.status === 'in_progress');
    
    if (overdueRecords.length > 0) {
      return (
        <Badge variant="destructive" className="text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {overdueRecords.length} Overdue
        </Badge>
      );
    }

    if (inProgressRecords.length > 0) {
      return (
        <Badge variant="default" className="text-xs bg-blue-600">
          <Clock className="h-3 w-3 mr-1" />
          In Progress
        </Badge>
      );
    }

    // Find next scheduled maintenance
    const upcomingRecords = truckMaintenanceRecords
      .filter(record => record.status === 'scheduled')
      .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime());

    if (upcomingRecords.length > 0) {
      const nextMaintenance = new Date(upcomingRecords[0].scheduled_date);
      return (
        <Badge variant="outline" className="text-xs">
          <Clock className="h-3 w-3 mr-1" />
          Due {nextMaintenance.toLocaleDateString()}
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="text-xs text-green-600">
        <Clock className="h-3 w-3 mr-1" />
        Up to date
      </Badge>
    );
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
          <div className="flex items-center gap-4">
            {/* Show/Hide Unavailable Toggle */}
            <div className="flex items-center gap-2">
              <Switch
                checked={showUnavailable}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowUnavailable(e.target.checked)}
              />
              <span className="text-sm text-gray-700">
                Show Unavailable Trucks
              </span>
              {!showUnavailable && (
                <EyeOff className="h-4 w-4 text-gray-500" />
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <TruckIcon className="h-5 w-5 text-[#1e786c]" />
              <span className="text-sm font-medium text-gray-700">
                {filteredTrucks.length} of {trucks.length} Trucks
              </span>
            </div>
            
            {/* Admin Only - Add Truck Button */}
            {isAdmin && (
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => setIsMaintenanceListOpen(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <List className="h-4 w-4 mr-2" />
                  View Maintenance
                </Button>
                
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
                          onChange={(e) => setFormData({...formData, truck_number: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="plate_number">Plate Number *</Label>
                        <Input
                          id="plate_number"
                          value={formData.plate_number}
                          onChange={(e) => setFormData({...formData, plate_number: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="model">Model *</Label>
                      <Input
                        id="model"
                        value={formData.model}
                        onChange={(e) => setFormData({...formData, model: e.target.value})}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="color">Color</Label>
                        <Input
                          id="color"
                          value={formData.color}
                          onChange={(e) => setFormData({...formData, color: e.target.value})}
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
                          onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="mileage">Mileage</Label>
                      <Input
                        id="mileage"
                        type="number"
                        min="0"
                        value={formData.mileage}
                        onChange={(e) => setFormData({...formData, mileage: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.is_available}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, is_available: e.target.checked})}
                      />
                      <Label>Available for trips</Label>
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, notes: e.target.value})}
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="flex-1 bg-[#1e786c] hover:bg-[#cfab3d]">
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
              </div>
            )}
          </div>
        </div>

        {/* Trucks Grid */}
        {filteredTrucks.length === 0 ? (
          <div className="text-center py-12">
            <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {trucks.length === 0 ? "No Trucks Found" : "No Available Trucks"}
            </h3>
            <p className="text-gray-600">
              {trucks.length === 0 
                ? "There are no trucks in your fleet yet." 
                : "All trucks are currently unavailable. Toggle to show unavailable trucks."
              }
            </p>
          </div>
        ) : (
          <>
            {/* Trucks Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Fleet Overview</h2>
                <p className="text-sm text-gray-600">Click on any truck to view detailed information</p>
              </div>
              <Badge variant="outline" className="text-sm">
                {filteredTrucks.length} {filteredTrucks.length === 1 ? 'Truck' : 'Trucks'}
              </Badge>
            </div>

            <div className="space-y-2">
            {filteredTrucks.map((truck) => {
              const isExpanded = expandedTrucks.has(truck.id);
              
              return (
                <Card key={truck.id} className="hover:shadow-lg transition-shadow">
                  {/* Compact List Header - Always Visible */}
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => toggleExpanded(truck.id)}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-500" />
                        )}
                        <TruckIcon className="h-4 w-4 text-[#1e786c]" />
                        <span className="font-semibold text-[#1e786c]">{truck.truck_number}</span>
                      </div>
                      
                      <div className="font-medium text-gray-800 truncate max-w-[200px]">
                        {truck.model}
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        {truck.plate_number}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!truck.is_available && (
                          <Badge variant="outline" className="text-xs">
                            Unavailable
                          </Badge>
                        )}
                        {getMaintenanceStatusBadge(truck)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isAdmin && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleAvailability(truck.id, truck.is_available);
                          }}
                          title={truck.is_available ? "Mark as unavailable" : "Mark as available"}
                        >
                          {truck.is_available ? (
                            <Power className="h-4 w-4 text-green-600" />
                          ) : (
                            <PowerOff className="h-4 w-4 text-red-600" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details - Conditionally Visible */}
                  {isExpanded && (
                    <div className="border-t">
                      <div className="p-6 space-y-4">
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
                          {isAdmin && (
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => openEditDialog(truck)}
                                className="border-[#cfab3d] text-[#cfab3d] hover:bg-[#cfab3d] hover:text-white"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => openMaintenanceDialog(truck)}
                                className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                              >
                                <Wrench className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
          </>
        )}
        
        {/* Edit Truck Dialog */}
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
                      onChange={(e) => setFormData({...formData, truck_number: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_plate_number">Plate Number *</Label>
                    <Input
                      id="edit_plate_number"
                      value={formData.plate_number}
                      onChange={(e) => setFormData({...formData, plate_number: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit_model">Model *</Label>
                  <Input
                    id="edit_model"
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_color">Color</Label>
                    <Input
                      id="edit_color"
                      value={formData.color}
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
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
                      onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
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
                    onChange={(e) => setFormData({...formData, mileage: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_notes">Notes</Label>
                  <Textarea
                    id="edit_notes"
                    value={formData.notes}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1 bg-[#1e786c] hover:bg-[#cfab3d]">
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

        {/* Maintenance Dialog */}
        {isMaintenanceDialogOpen && selectedTruckForMaintenance && (
          <Dialog open={isMaintenanceDialogOpen} onOpenChange={() => setIsMaintenanceDialogOpen(false)}>
            <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] mx-auto bg-white rounded-lg shadow-lg overflow-y-auto" style={{
              maxWidth: '95vw',
              width: '95vw', 
              height: '90vh',
              margin: 'auto'
            }}>
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-semibold text-gray-900">
                  Schedule Maintenance - {selectedTruckForMaintenance.plate_number}
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-2">
                  Schedule maintenance for this truck by filling out the form below. All fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleMaintenanceSubmit} className="space-y-8 p-6">
                {/* First Row - Type and Date */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maintenance Type *
                    </label>
                    <select
                      value={maintenanceFormData.maintenance_type}
                      onChange={(e) => setMaintenanceFormData(prev => ({
                        ...prev,
                        maintenance_type: e.target.value as 'routine' | 'repair' | 'inspection' | 'emergency'
                      }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      required
                    >
                      <option value="">Select maintenance type</option>
                      <option value="routine">Routine Maintenance</option>
                      <option value="repair">Repair</option>
                      <option value="inspection">Inspection</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scheduled Date *
                    </label>
                    <input
                      type="datetime-local"
                      value={maintenanceFormData.scheduled_date}
                      onChange={(e) => setMaintenanceFormData(prev => ({
                        ...prev,
                        scheduled_date: e.target.value
                      }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      required
                    />
                  </div>
                </div>

                {/* Second Row - Description (full width) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <input
                    type="text"
                    value={maintenanceFormData.description}
                    onChange={(e) => setMaintenanceFormData(prev => ({
                      ...prev,
                      description: e.target.value
                    }))}
                    placeholder="Brief description of the maintenance"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    required
                  />
                </div>

                {/* Third Row - Provider and Cost */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Provider
                    </label>
                    <input
                      type="text"
                      value={maintenanceFormData.service_provider || ''}
                      onChange={(e) => setMaintenanceFormData(prev => ({
                        ...prev,
                        service_provider: e.target.value
                      }))}
                      placeholder="Enter service provider name"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Cost (₱)
                    </label>
                    <input
                      type="number"
                      value={maintenanceFormData.cost || ''}
                      onChange={(e) => setMaintenanceFormData(prev => ({
                        ...prev,
                        cost: e.target.value ? parseFloat(e.target.value) : undefined
                      }))}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    />
                  </div>
                </div>

                {/* Fourth Row - Mileage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mileage at Service
                  </label>
                  <input
                    type="number"
                    value={maintenanceFormData.mileage_at_service || ''}
                    onChange={(e) => setMaintenanceFormData(prev => ({
                      ...prev,
                      mileage_at_service: e.target.value ? parseInt(e.target.value) : undefined
                    }))}
                    placeholder="Current mileage"
                    min="0"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  />
                </div>

                {/* Fifth Row - Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={maintenanceFormData.notes || ''}
                    onChange={(e) => setMaintenanceFormData(prev => ({
                      ...prev,
                      notes: e.target.value
                    }))}
                    placeholder="Additional notes or details..."
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-8">
                  <button
                    type="button"
                    onClick={() => setIsMaintenanceDialogOpen(false)}
                    className="px-6 py-3 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 text-base font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center space-x-2 text-base font-medium"
                  >
                    <Wrench className="h-5 w-5" />
                    <span>Schedule Maintenance</span>
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* Maintenance List Dialog */}
        {isMaintenanceListOpen && (
          <Dialog open={isMaintenanceListOpen} onOpenChange={() => setIsMaintenanceListOpen(false)}>
            <DialogContent className="max-w-[98vw] w-[98vw] h-[95vh] mx-auto bg-white rounded-lg shadow-lg overflow-hidden" style={{
              maxWidth: '98vw',
              width: '98vw', 
              height: '95vh',
              margin: 'auto'
            }}>
              <DialogHeader className="pb-6">
                <DialogTitle className="text-2xl font-semibold text-gray-900">
                  Maintenance Records
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-2">
                  View and manage all maintenance records for your fleet. Use the status dropdowns to update maintenance progress.
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex flex-col h-full space-y-6 overflow-hidden p-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-shrink-0">
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Total Records</p>
                        <p className="text-3xl font-bold text-blue-800">{maintenanceRecords.length}</p>
                      </div>
                      <List className="h-10 w-10 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Completed</p>
                        <p className="text-3xl font-bold text-green-800">
                          {maintenanceRecords.filter(r => r.status === 'completed').length}
                        </p>
                      </div>
                      <CheckCircle className="h-10 w-10 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-600 text-sm font-medium">Scheduled</p>
                        <p className="text-3xl font-bold text-yellow-800">
                          {maintenanceRecords.filter(r => r.status === 'scheduled').length}
                        </p>
                      </div>
                      <Clock className="h-10 w-10 text-yellow-500" />
                    </div>
                  </div>
                  
                  <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-600 text-sm font-medium">In Progress</p>
                        <p className="text-3xl font-bold text-red-800">
                          {maintenanceRecords.filter(r => r.status === 'in_progress').length}
                        </p>
                      </div>
                      <AlertTriangle className="h-10 w-10 text-red-500" />
                    </div>
                  </div>
                </div>

                {/* Maintenance Records Table */}
                <div className="flex-1 border rounded-lg overflow-hidden flex flex-col min-h-0 shadow-sm">
                  <div className="flex-1 overflow-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-4 text-left text-sm font-medium text-gray-700 w-24">Truck</th>
                          <th className="px-4 py-4 text-left text-sm font-medium text-gray-700 w-20">Type</th>
                          <th className="px-4 py-4 text-left text-sm font-medium text-gray-700">Description & Details</th>
                          <th className="px-4 py-4 text-left text-sm font-medium text-gray-700 w-24">Date</th>
                          <th className="px-4 py-4 text-left text-sm font-medium text-gray-700 w-28">Status</th>
                          <th className="px-4 py-4 text-left text-sm font-medium text-gray-700 w-20">Cost</th>
                          <th className="px-4 py-4 text-left text-sm font-medium text-gray-700 w-24">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {maintenanceRecords.map((record) => {
                          const truck = trucks.find(t => t.id === record.truck_id);
                          const isEditing = editingRecordId === record.id;
                          return (
                            <tr key={record.id} className="hover:bg-gray-50">
                              <td className="px-4 py-4">
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm text-gray-900">
                                    {truck?.truck_number || `#${record.truck_id}`}
                                  </span>
                                  <span className="text-sm text-gray-500">{truck?.model}</span>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className={`inline-flex px-2 py-1 text-sm font-semibold rounded ${
                                  record.maintenance_type === 'routine' ? 'bg-blue-100 text-blue-800' :
                                  record.maintenance_type === 'repair' ? 'bg-orange-100 text-orange-800' :
                                  record.maintenance_type === 'inspection' ? 'bg-green-100 text-green-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {record.maintenance_type === 'routine' ? 'Routine' :
                                   record.maintenance_type === 'repair' ? 'Repair' :
                                   record.maintenance_type === 'inspection' ? 'Inspect' : 'Emergency'}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                {isEditing ? (
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      value={editFormData.description || ''}
                                      onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                                      className="w-full text-sm p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                      placeholder="Description"
                                    />
                                    <input
                                      type="text"
                                      value={editFormData.service_provider || ''}
                                      onChange={(e) => setEditFormData(prev => ({ ...prev, service_provider: e.target.value }))}
                                      className="w-full text-sm p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                      placeholder="Service Provider"
                                    />
                                    <input
                                      type="number"
                                      value={editFormData.cost || ''}
                                      onChange={(e) => setEditFormData(prev => ({ ...prev, cost: e.target.value ? parseFloat(e.target.value) : undefined }))}
                                      className="w-full text-sm p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                      placeholder="Cost (₱)"
                                    />
                                    <textarea
                                      value={editFormData.notes || ''}
                                      onChange={(e) => setEditFormData(prev => ({ ...prev, notes: e.target.value }))}
                                      className="w-full text-sm p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                      rows={2}
                                      placeholder="Notes"
                                    />
                                  </div>
                                ) : (
                                  <div className="space-y-1">
                                    <p className="text-sm text-gray-900 font-medium">{record.description}</p>
                                    {record.service_provider && (
                                      <p className="text-sm text-gray-600">
                                        <span className="font-medium">Provider:</span> {record.service_provider}
                                      </p>
                                    )}
                                    {record.cost && (
                                      <p className="text-sm text-green-600 font-medium">
                                        <span className="font-normal text-gray-600">Cost:</span> ₱{record.cost.toLocaleString()}
                                      </p>
                                    )}
                                    {record.notes && (
                                      <p className="text-sm text-gray-500">
                                        <span className="font-medium">Notes:</span> {record.notes}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-4">
                                <div className="text-sm">
                                  <p className="text-gray-900 font-medium">
                                    {new Date(record.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </p>
                                  <p className="text-gray-500">
                                    {new Date(record.scheduled_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </p>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <select
                                  value={record.status}
                                  onChange={(e) => handleStatusChange(record.id, e.target.value as 'scheduled' | 'in_progress' | 'completed' | 'cancelled')}
                                  className={`text-sm px-3 py-2 rounded border font-medium w-full focus:ring-2 focus:ring-blue-500 ${
                                    record.status === 'completed' ? 'bg-green-100 text-green-800 border-green-300' :
                                    record.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                                    record.status === 'scheduled' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                    'bg-gray-100 text-gray-800 border-gray-300'
                                  }`}
                                >
                                  <option value="scheduled">Scheduled</option>
                                  <option value="in_progress">In Progress</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td className="px-3 py-4">
                                {record.cost && !isEditing && (
                                  <span className="text-sm font-medium text-gray-900">
                                    ₱{(record.cost / 1000).toFixed(0)}k
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-4">
                                {isEditing ? (
                                  <div className="flex flex-col space-y-2">
                                    <button
                                      onClick={saveEditRecord}
                                      className="text-sm px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:ring-2 focus:ring-green-500"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={cancelEditRecord}
                                      className="text-sm px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:ring-2 focus:ring-gray-500"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => startEditRecord(record)}
                                    className="text-sm px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 w-full"
                                  >
                                    Edit
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {maintenanceRecords.length === 0 && (
                  <div className="text-center py-12">
                    <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Maintenance Records</h3>
                    <p className="text-gray-600">No maintenance records found. Schedule maintenance for your trucks to see records here.</p>
                  </div>
                )}

                <div className="flex justify-end pt-4 flex-shrink-0">
                  <button
                    onClick={() => setIsMaintenanceListOpen(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AuthLayout>
  );
}
