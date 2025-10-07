import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Truck, MapPin, Package, User } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { bookingAPI, type BookingData } from "@/services/booking-api";

interface TripBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TripBookingDialog({ open, onOpenChange }: TripBookingDialogProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [trucks, setTrucks] = useState<any[]>([]);
  const [loadingTrucks, setLoadingTrucks] = useState(false);
  const [formData, setFormData] = useState<BookingData>({
    trip_date: '',
    client_name: user?.name || '',
    client_contact: user?.phone || '',
    client_email: user?.email || '',
    departure_point: '',
    destination: '',
    goods_description: '',
    cargo_weight: 0,
    cargo_type: '',
    truck_id: 0,
    estimated_departure_time: '',
    estimated_arrival_time: '',
    special_instructions: '',
    route_notes: ''
  });

  // Load available trucks when dialog opens
  useEffect(() => {
    if (open) {
      loadAvailableTrucks();
    }
  }, [open]);

  const loadAvailableTrucks = async () => {
    try {
      setLoadingTrucks(true);
      const response = await bookingAPI.getAvailableTrucks();
      if (response.data.success) {
        setTrucks(response.data.data);
      }
    } catch (error) {
      console.error('Error loading trucks:', error);
    } finally {
      setLoadingTrucks(false);
    }
  };

  const handleInputChange = (field: keyof BookingData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await bookingAPI.createBooking(formData);
      
      if (response.data.success) {
        alert('Trip booking submitted successfully! We will contact you shortly to confirm details.');
        onOpenChange(false);
        
        // Reset form
        setFormData({
          trip_date: '',
          client_name: user?.name || '',
          client_contact: user?.phone || '',
          client_email: user?.email || '',
          departure_point: '',
          destination: '',
          goods_description: '',
          cargo_weight: 0,
          cargo_type: '',
          truck_id: 0,
          estimated_departure_time: '',
          estimated_arrival_time: '',
          special_instructions: '',
          route_notes: ''
        });
      } else {
        alert(response.data.message || 'Failed to submit booking. Please try again.');
      }
    } catch (error: any) {
      console.error('Error submitting booking:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit booking. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-4xl w-[95vw] h-[90vh] overflow-y-auto bg-white"
        style={{
          maxWidth: '95vw',
          width: '95vw',
          height: '90vh',
          margin: 'auto',
          borderRadius: '8px',
          padding: '24px',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-bold text-[#1e786c] flex items-center gap-3">
            <Truck className="h-6 w-6" />
            Book Your Trip
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Fill out the details below to book your transportation service. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Trip Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-[#1e786c]" />
              Trip Information
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="trip_date" className="font-medium">Trip Date *</Label>
                <Input
                  id="trip_date"
                  type="date"
                  value={formData.trip_date}
                  onChange={(e) => handleInputChange('trip_date', e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="text-base p-3"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cargo_type" className="font-medium">Cargo Type *</Label>
                <Input
                  id="cargo_type"
                  value={formData.cargo_type}
                  onChange={(e) => handleInputChange('cargo_type', e.target.value)}
                  required
                  placeholder="e.g., General Cargo, Electronics, Construction Materials"
                  className="text-base p-3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="truck_id" className="font-medium">Select Truck *</Label>
                {loadingTrucks ? (
                  <div className="text-base p-3 border rounded-md bg-gray-50">Loading trucks...</div>
                ) : (
                  <Select value={formData.truck_id?.toString() || ""} onValueChange={(value) => handleInputChange('truck_id', parseInt(value))}>
                    <SelectTrigger className="text-base p-3">
                      <SelectValue placeholder="Choose an available truck" />
                    </SelectTrigger>
                    <SelectContent>
                      {trucks.map((truck) => (
                        <SelectItem key={truck.id} value={truck.id.toString()}>
                          {truck.truck_number} - {truck.model} ({truck.plate_number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
              <User className="h-5 w-5 text-[#1e786c]" />
              Contact Information
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="client_name" className="font-medium">Full Name *</Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => handleInputChange('client_name', e.target.value)}
                  required
                  placeholder="Your full name"
                  className="text-base p-3"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client_contact" className="font-medium">Phone Number *</Label>
                <Input
                  id="client_contact"
                  value={formData.client_contact}
                  onChange={(e) => handleInputChange('client_contact', e.target.value)}
                  required
                  placeholder="+63 917 123 4567"
                  className="text-base p-3"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client_email" className="font-medium">Email Address</Label>
                <Input
                  id="client_email"
                  type="email"
                  value={formData.client_email}
                  onChange={(e) => handleInputChange('client_email', e.target.value)}
                  placeholder="your@email.com"
                  className="text-base p-3"
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#1e786c]" />
              Route Details
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="departure_point" className="font-medium">Pickup Location *</Label>
                <Input
                  id="departure_point"
                  value={formData.departure_point}
                  onChange={(e) => handleInputChange('departure_point', e.target.value)}
                  required
                  placeholder="Full pickup address"
                  className="text-base p-3"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="destination" className="font-medium">Delivery Location *</Label>
                <Input
                  id="destination"
                  value={formData.destination}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                  required
                  placeholder="Full delivery address"
                  className="text-base p-3"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="estimated_departure_time" className="font-medium">Preferred Pickup Time</Label>
                <Input
                  id="estimated_departure_time"
                  type="time"
                  value={formData.estimated_departure_time}
                  onChange={(e) => handleInputChange('estimated_departure_time', e.target.value)}
                  className="text-base p-3"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estimated_arrival_time" className="font-medium">Preferred Delivery Time</Label>
                <Input
                  id="estimated_arrival_time"
                  type="time"
                  value={formData.estimated_arrival_time}
                  onChange={(e) => handleInputChange('estimated_arrival_time', e.target.value)}
                  className="text-base p-3"
                />
              </div>
            </div>
          </div>

          {/* Cargo Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
              <Package className="h-5 w-5 text-[#1e786c]" />
              Cargo Details
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="goods_description" className="font-medium">Goods Description *</Label>
                <Textarea
                  id="goods_description"
                  value={formData.goods_description}
                  onChange={(e) => handleInputChange('goods_description', e.target.value)}
                  required
                  placeholder="Describe what you're shipping (e.g., Electronics, Furniture, Raw materials)"
                  className="text-base p-3 min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cargo_weight" className="font-medium">Estimated Weight (tons)</Label>
                <Input
                  id="cargo_weight"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.cargo_weight}
                  onChange={(e) => handleInputChange('cargo_weight', parseFloat(e.target.value) || 0)}
                  placeholder="0.5"
                  className="text-base p-3"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Additional Information</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="route_notes" className="font-medium">Route Preferences</Label>
                <Textarea
                  id="route_notes"
                  value={formData.route_notes}
                  onChange={(e) => handleInputChange('route_notes', e.target.value)}
                  placeholder="Any specific route preferences or restrictions"
                  className="text-base p-3"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="special_instructions" className="font-medium">Special Instructions</Label>
                <Textarea
                  id="special_instructions"
                  value={formData.special_instructions}
                  onChange={(e) => handleInputChange('special_instructions', e.target.value)}
                  placeholder="Any special handling requirements, delivery instructions, or other notes"
                  className="text-base p-3"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="px-6 py-3"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#cfab3d] hover:bg-[#b8961e] text-white px-8 py-3 font-medium"
            >
              {loading ? 'Submitting...' : 'Submit Booking Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}