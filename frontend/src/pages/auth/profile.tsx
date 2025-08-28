import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, Edit, Save, X } from "lucide-react";
import AuthLayout from "@/components/shared/auth-layout";

// Dummy user data
const dummyUserData = {
  name: "John Doe",
  age: "32",
  contact: "+63 912 345 6789",
  address: "Toril, Davo City",
  emergencyName: "Jane Doe",
  emergencyContact: "+63 917 890 1234",
};

export default function ProfilePage() {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [licensePic, setLicensePic] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(dummyUserData);

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = URL.createObjectURL(e.target.files[0]);
      setProfilePic(file);
    }
  };

  const handleLicenseUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = URL.createObjectURL(e.target.files[0]);
      setLicensePic(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save the data to your backend
    console.log("Saved data:", userData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUserData(dummyUserData); // Reset to original data
  };

  return (
    <AuthLayout title="Profile">
      <div className="flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-4xl relative">
          {/* Header with Edit Button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#1e786c]">
              Personal Information
            </h2>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="flex items-center gap-2 border-[#cfab3d] text-[#1e786c] hover:bg-[#cfab3d] hover:bg-opacity-10"
              >
                <Edit size={16} />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-[#1e786c] hover:bg-[#1a6b60]"
                >
                  <Save size={16} />
                  Save Changes
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex items-center gap-2 border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  <X size={16} />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <Avatar className="w-32 h-32 border-4 border-[#cfab3d] shadow-lg">
                {profilePic ? (
                  <AvatarImage src={profilePic} alt="Profile" />
                ) : (
                  <AvatarFallback className="text-[#1e786c] font-bold text-2xl bg-[#cfab3d] bg-opacity-20">
                    JD
                  </AvatarFallback>
                )}
              </Avatar>

              {isEditing && (
                <label
                  htmlFor="profile-upload"
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition"
                >
                  <Camera className="text-white w-8 h-8" />
                  <Input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileUpload}
                  />
                </label>
              )}
            </div>
            <p className="mt-3 font-semibold text-gray-700">Profile Picture</p>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-bold text-[#1e786c] mb-1"
                >
                  Name
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="border-[#cfab3d] focus:ring-[#1e786c] disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-bold text-[#1e786c] mb-1"
                >
                  Age
                </label>
                <Input
                  type="number"
                  id="age"
                  name="age"
                  value={userData.age}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="border-[#cfab3d] focus:ring-[#1e786c] disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label
                  htmlFor="contact"
                  className="block text-sm font-bold text-[#1e786c] mb-1"
                >
                  Contact Number
                </label>
                <Input
                  type="tel"
                  id="contact"
                  name="contact"
                  value={userData.contact}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="border-[#cfab3d] focus:ring-[#1e786c] disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-bold text-[#1e786c] mb-1"
                >
                  Address
                </label>
                <Input
                  type="text"
                  id="address"
                  name="address"
                  value={userData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="border-[#cfab3d] focus:ring-[#1e786c] disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label
                  htmlFor="emergencyName"
                  className="block text-sm font-bold text-[#1e786c] mb-1"
                >
                  Emergency Contact Name
                </label>
                <Input
                  type="text"
                  id="emergencyName"
                  name="emergencyName"
                  value={userData.emergencyName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="border-[#cfab3d] focus:ring-[#1e786c] disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label
                  htmlFor="emergencyContact"
                  className="block text-sm font-bold text-[#1e786c] mb-1"
                >
                  Emergency Contact Number
                </label>
                <Input
                  type="tel"
                  id="emergencyContact"
                  name="emergencyContact"
                  value={userData.emergencyContact}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="border-[#cfab3d] focus:ring-[#1e786c] disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-[#1e786c] mb-2">
                  Driver's License
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Upload a clear photo of your driver's license
                </p>
              </div>

              <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#cfab3d] rounded-xl p-6 relative bg-gray-50 hover:bg-gray-100 transition cursor-pointer h-72">
                {licensePic ? (
                  <img
                    src={licensePic}
                    alt="Driver License"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <Upload className="w-10 h-10 mb-3 text-[#1e786c]" />
                    <p className="font-medium text-center">
                      Drag & Drop or Click to Upload
                    </p>
                    <p className="text-sm text-gray-400 text-center mt-1">
                      Driver's License Photo
                    </p>
                  </div>
                )}
                {isEditing && (
                  <Input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleLicenseUpload}
                  />
                )}
              </div>

              {!isEditing && (
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Contact support to update your driver's license
                </p>
              )}
            </div>
          </form>

          {isEditing && (
            <div className="mt-10 text-center">
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-[#1e786c] to-[#cfab3d] text-white font-bold px-8 py-3 rounded-full hover:scale-105 hover:shadow-lg transition"
              >
                Save Profile
              </Button>
            </div>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
