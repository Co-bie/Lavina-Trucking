import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Upload,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { driversAPI } from "@/services/api";
import type { User as DriverType } from "@/types/type";

type DriverProfileProps = {
  params: { id: string };
};

export default function DriverProfile({ params }: DriverProfileProps) {
  const [driver, setDriver] = useState<DriverType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [licenseImage, setLicenseImage] = useState<string | null>(null);

  useEffect(() => {
    fetchDriver();
  }, [params.id]);

  const fetchDriver = async () => {
    try {
      setLoading(true);
      const response = await driversAPI.getDriver(parseInt(params.id));
      if (response.data.success) {
        setDriver(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching driver:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!driver) return;
    
    try {
      setSaving(true);
      const response = await driversAPI.updateDriver(driver.id, driver);
      if (response.data.success) {
        setDriver(response.data.data);
        setIsEditing(false);
        alert("Driver profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating driver:", error);
      alert("Failed to update driver profile");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof DriverType, value: any) => {
    if (!driver) return;
    setDriver({ ...driver, [field]: value });
  };

  const handleLicenseUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = URL.createObjectURL(e.target.files[0]);
      setLicenseImage(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e786c] mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading driver profile...</p>
        </div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center shadow-lg max-w-md w-full">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Driver Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The driver with ID "{params.id}" does not exist.
          </p>
          <Link href="/drivers">
            <Button className="bg-[#1e786c] hover:bg-[#1e786c]/90">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Drivers
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/drivers">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Drivers
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Driver Profile</h1>
          <div className="ml-auto">
            <Button
              variant={isEditing ? "destructive" : "outline"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : <Edit className="mr-2 h-4 w-4" />}
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture and Basic Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage 
                      src={driver.profile_picture ? `http://localhost:8000/storage/profile_pictures/${driver.profile_picture}` : undefined} 
                      alt={driver.name} 
                    />
                    <AvatarFallback className="text-2xl">
                      {driver.first_name?.[0] || driver.name[0]}{driver.last_name?.[0] || driver.name[1]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-gray-900">{driver.name}</h2>
                    <Badge variant={driver.is_active ? "default" : "secondary"}>
                      {driver.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  {/* Star Rating Placeholder */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-gray-300 rounded-sm"></div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    {isEditing ? (
                      <Input value={driver.name} disabled />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded border">
                        {driver.name}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    {isEditing ? (
                      <Input 
                        type="number" 
                        value={driver.age || ''} 
                        placeholder="Enter age"
                        onChange={(e) => handleInputChange('age', parseInt(e.target.value) || null)}
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded border">
                        {driver.age || 'Not provided'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact No.
                    </label>
                    {isEditing ? (
                      <Input 
                        value={driver.phone || ''} 
                        placeholder="Enter phone number"
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded border flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        {driver.phone || 'Not provided'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    {isEditing ? (
                      <Input 
                        value={driver.address || ''} 
                        placeholder="Enter address"
                        onChange={(e) => handleInputChange('address', e.target.value)}
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded border flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        {driver.address || 'Not provided'}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name of Emergency Contact
                    </label>
                    {isEditing ? (
                      <Input 
                        value={driver.emergency_contact_name || ''} 
                        placeholder="Enter emergency contact name"
                        onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded border">
                        {driver.emergency_contact_name || 'Not provided'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      No. of Emergency Contact
                    </label>
                    {isEditing ? (
                      <Input 
                        value={driver.emergency_contact_phone || ''} 
                        placeholder="Enter emergency contact phone"
                        onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded border">
                        {driver.emergency_contact_phone || 'Not provided'}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Driver's License */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Driver's License
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        License Number
                      </label>
                      {isEditing ? (
                        <Input 
                          value={driver.license_number || ''} 
                          placeholder="Enter license number"
                          onChange={(e) => handleInputChange('license_number', e.target.value)}
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded border">
                          {driver.license_number || 'Not provided'}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        License Class
                      </label>
                      {isEditing ? (
                        <Input 
                          value={driver.license_class || ''} 
                          placeholder="Enter license class"
                          onChange={(e) => handleInputChange('license_class', e.target.value)}
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded border">
                          {driver.license_class || 'Not provided'}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      {isEditing ? (
                        <Input type="date" value={driver.license_expiry || ''} />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded border flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {driver.license_expiry ? new Date(driver.license_expiry).toLocaleDateString() : 'Not provided'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Picture of Driver's License
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {licenseImage ? (
                        <div className="space-y-2">
                          <img 
                            src={licenseImage} 
                            alt="Driver's License" 
                            className="max-w-full h-32 object-contain mx-auto"
                          />
                          {isEditing && (
                            <Button variant="outline" size="sm" onClick={() => setLicenseImage(null)}>
                              Remove
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-gray-400 text-sm">Picture of Driver's License</div>
                          {isEditing && (
                            <div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleLicenseUpload}
                                className="hidden"
                                id="license-upload"
                              />
                              <label htmlFor="license-upload">
                                <Button variant="outline" size="sm" asChild>
                                  <span className="cursor-pointer">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Image
                                  </span>
                                </Button>
                              </label>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {isEditing && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-[#1e786c] hover:bg-[#1e786c]/90"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
