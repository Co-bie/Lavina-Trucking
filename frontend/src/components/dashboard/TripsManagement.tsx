import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Truck, User, Calendar, MapPin, Package, DollarSign, Clock, ShieldAlert, ChevronDown, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { tripsAPI, type Trip } from '../../lib/api/trips';
import { driversAPI } from '../../services/api';
import { useAuth } from '../../contexts/auth-context';

interface Driver {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  license_number?: string;
  is_active: boolean;
}

interface TripsManagementProps {
  className?: string;
}

const TripsManagement: React.FC<TripsManagementProps> = ({ className }) => {
  const { user } = useAuth();
  const isAdmin = user?.user_type === 'admin';
  const [trips, setTrips] = useState<Trip[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningTrip, setAssigningTrip] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [expandedTrips, setExpandedTrips] = useState<Set<number>>(new Set());

  const toggleExpanded = (tripId: number) => {
    const newExpanded = new Set(expandedTrips);
    if (newExpanded.has(tripId)) {
      newExpanded.delete(tripId);
    } else {
      newExpanded.add(tripId);
    }
    setExpandedTrips(newExpanded);
  };

  useEffect(() => {
    loadTrips();
    loadDrivers();
  }, []);

  const loadTrips = async () => {
    try {
      const response = await tripsAPI.getTrips();
      if (response.success) {
        setTrips(response.data);
      }
    } catch (error) {
      console.error('Failed to load trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDrivers = async () => {
    try {
      const response = await driversAPI.getDrivers();
      if (response.data.success) {
        setDrivers(response.data.data.filter((driver: Driver) => driver.is_active));
      }
    } catch (error) {
      console.error('Failed to load drivers:', error);
    }
  };

  const handleAssignDriver = async (tripId: number, driverId: string) => {
    // Don't process placeholder values
    if (driverId === '__placeholder__') return;
    
    // Clear previous messages
    setSuccessMessage('');
    setErrorMessage('');
    setAssigningTrip(tripId);
    
    try {
      if (driverId === '__unassign__') {
        // Unassign driver
        const response = await tripsAPI.unassignDriver(tripId);
        if (response.success) {
          setTrips(prev => prev.map(trip => 
            trip.id === tripId ? response.data : trip
          ));
          setSuccessMessage(`Successfully unassigned driver from trip ${response.data.trip_code}`);
        }
      } else {
        // Assign/change driver
        const response = await tripsAPI.assignDriver(tripId, parseInt(driverId));
        if (response.success) {
          setTrips(prev => prev.map(trip => 
            trip.id === tripId ? response.data : trip
          ));
          
          const assignedDriver = drivers.find(d => d.id === parseInt(driverId));
          setSuccessMessage(`Successfully assigned ${assignedDriver?.name || 'driver'} to trip ${response.data.trip_code}`);
        }
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      console.error('Failed to assign/unassign driver:', error);
      setErrorMessage(error.message || 'Failed to update driver assignment. Please try again.');
    } finally {
      setAssigningTrip(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCargoTypeColor = (type: string) => {
    switch (type) {
      case 'fragile': return 'bg-orange-100 text-orange-800';
      case 'perishable': return 'bg-green-100 text-green-800';
      case 'hazardous': return 'bg-red-100 text-red-800';
      case 'heavy': return 'bg-purple-100 text-purple-800';
      case 'temperature_controlled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(parseFloat(amount));
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-gray-500">Loading trips...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className={className}>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShieldAlert className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin Access Required</h3>
            <p className="text-gray-600 text-center">You need administrator privileges to access trip management features.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}
      
      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {errorMessage}
          <button 
            onClick={() => setErrorMessage('')}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Trip Management</h2>
        <Badge variant="outline" className="text-sm">
          {trips.length} {trips.length === 1 ? 'Trip' : 'Trips'}
        </Badge>
      </div>

      <div className="space-y-2">
        {trips.map((trip) => {
          const isExpanded = expandedTrips.has(trip.id);
          
          return (
            <Card key={trip.id} className="hover:shadow-lg transition-shadow">
              {/* Compact List Header - Always Visible */}
              <div 
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => toggleExpanded(trip.id)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="font-semibold text-blue-600">{trip.trip_code}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="h-3 w-3" />
                    {formatDate(trip.trip_date)}
                  </div>
                  
                  <div className="font-medium text-gray-800 truncate max-w-[200px]">
                    {trip.client_name}
                  </div>
                  
                  <Badge className={getStatusColor(trip.status)}>
                    {trip.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="h-3 w-3" />
                  {formatCurrency(trip.estimated_cost)}
                </div>
              </div>

              {/* Expanded Details - Conditionally Visible */}
              {isExpanded && (
                <div className="border-t">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-semibold text-blue-600">
                          {trip.trip_code}
                        </CardTitle>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(trip.trip_date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {formatCurrency(trip.estimated_cost)}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getStatusColor(trip.status)}>
                          {trip.status.toUpperCase()}
                        </Badge>
                        <Badge className={getCargoTypeColor(trip.cargo_type)}>
                          {trip.cargo_type.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Trip Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Client Information</h4>
                    <div className="space-y-1 text-sm">
                      <div className="font-medium">{trip.client_name}</div>
                      <div className="text-gray-600">{trip.client_contact}</div>
                      <div className="text-gray-600">{trip.client_email}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Route</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 text-green-600" />
                        <div>
                          <div className="font-medium">From</div>
                          <div className="text-gray-600">{trip.departure_point}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 text-red-600" />
                        <div>
                          <div className="font-medium">To</div>
                          <div className="text-gray-600">{trip.destination}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Cargo Details</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span>{trip.goods_description}</span>
                      </div>
                      <div className="text-gray-600">
                        Weight: {trip.cargo_weight} tons
                      </div>
                      {trip.special_instructions && (
                        <div className="text-gray-600 italic">
                          {trip.special_instructions}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Schedule</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Departure: {trip.estimated_departure_time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Arrival: {trip.estimated_arrival_time}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assignment Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Assigned Truck</h4>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Truck className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">{trip.truck.truck_number}</div>
                        <div className="text-sm text-gray-600">
                          {trip.truck.model} • {trip.truck.plate_number}
                        </div>
                        <div className="text-sm text-gray-600">
                          {trip.truck.color} • {trip.truck.year}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Driver Assignment</h4>
                    
                    {trip.driver && (
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg mb-3">
                        <User className="h-5 w-5 text-green-600" />
                        <div className="flex-1">
                          <div className="font-medium">{trip.driver.name}</div>
                          <div className="text-sm text-gray-600">{trip.driver.email}</div>
                          {trip.driver.phone && (
                            <div className="text-sm text-gray-600">{trip.driver.phone}</div>
                          )}
                          {trip.driver.license_number && (
                            <div className="text-sm text-gray-600">
                              License: {trip.driver.license_number}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                          Assigned
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      {!trip.driver && (
                        <div className="p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800">
                          No driver assigned yet
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {trip.driver ? 'Change Driver:' : 'Assign Driver:'}
                        </label>
                        <Select
                          onValueChange={(value) => handleAssignDriver(trip.id, value)}
                          disabled={assigningTrip === trip.id}
                          value={trip.driver ? trip.driver.id.toString() : "__placeholder__"}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a driver" />
                          </SelectTrigger>
                          <SelectContent>
                            {/* Placeholder option for unassigned trips */}
                            {!trip.driver && (
                              <SelectItem value="__placeholder__" disabled>
                                <div className="text-gray-400">
                                  Select a driver
                                </div>
                              </SelectItem>
                            )}
                            
                            {/* Option to unassign driver */}
                            {trip.driver && (
                              <SelectItem value="__unassign__">
                                <div className="text-red-600">
                                  <div className="font-medium">Unassign Driver</div>
                                  <div className="text-xs">Remove current driver assignment</div>
                                </div>
                              </SelectItem>
                            )}
                            
                            {drivers.map((driver) => (
                              <SelectItem key={driver.id} value={driver.id.toString()}>
                                <div>
                                  <div className="font-medium">{driver.name}</div>
                                  <div className="text-sm text-gray-600">{driver.email}</div>
                                  {driver.license_number && (
                                    <div className="text-xs text-gray-500">
                                      License: {driver.license_number}
                                    </div>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {assigningTrip === trip.id && (
                          <div className="text-sm text-blue-600 mt-2">
                            {trip.driver ? 'Changing driver...' : 'Assigning driver...'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
                  </div>
                )}
              </Card>
            );
          })}

        {trips.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No trips available</h3>
              <p className="text-gray-500">No trips have been scheduled yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TripsManagement;
