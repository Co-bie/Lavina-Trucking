import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, Edit, Save, X } from "lucide-react";
import AuthLayout from "@/components/shared/auth-layout";
import ClientLayout from "@/components/shared/client-layout";
import { profileAPI } from "@/services/api";
import { useAuth } from "@/contexts/auth-context";
import type { User } from "@/types/type";

export default function ProfilePage() {
  const { user: authUser, updateUser } = useAuth();
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [licensePic, setLicensePic] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [userData, setUserData] = useState<Partial<User>>({});
  const [originalData, setOriginalData] = useState<Partial<User>>({});

  // Load user profile data
  useEffect(() => {
    loadProfile();
  }, [authUser]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      
      // Use the authenticated user data first
      if (authUser) {
        setUserData(authUser);
        setOriginalData(authUser);
        
        if (authUser.profile_picture) {
          setProfilePic(authUser.profile_picture);
        }
        setLoading(false);
        return;
      }

      // Fallback to API call if no user in context
      const response = await profileAPI.getProfile();
      
      if (response.data.success) {
        const profileData = response.data.data;
        setUserData(profileData);
        setOriginalData(profileData);
        
        if (profileData.profile_picture) {
          setProfilePic(profileData.profile_picture);
        }
      }
    } catch (error: any) {
      alert("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      try {
        setUploadingPicture(true);
        const file = e.target.files[0];
        
        // Show preview immediately
        const previewUrl = URL.createObjectURL(file);
        setProfilePic(previewUrl);
        
        // Upload to server
        const response = await profileAPI.uploadProfilePicture(file, authUser?.id);
        
        if (response.data.success) {
          setProfilePic(response.data.data.profile_picture);
          setUserData(prev => ({ ...prev, profile_picture: response.data.data.profile_picture }));
          alert("Profile picture updated successfully!");
        }
      } catch (error: any) {
        alert("Failed to upload profile picture");
        // Reset to original if upload failed
        setProfilePic(userData.profile_picture || null);
      } finally {
        setUploadingPicture(false);
      }
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

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Include the authenticated user's ID in the update data
      const updateData = {
        ...userData,
        user_id: authUser?.id
      };
      
      const response = await profileAPI.updateProfile(updateData);
      
      if (response.data.success) {
        const updatedUserData = response.data.data;
        setOriginalData(updatedUserData);
        setUserData(updatedUserData);
        
        // Update the auth context with the new user data
        updateUser(updatedUserData);
        
        setIsEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (error: any) {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUserData(originalData); // Reset to original data
    setProfilePic(originalData.profile_picture || null);
  };

  if (loading) {
    const LoadingContent = () => (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e786c] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );

    return authUser?.user_type === 'client' ? (
      <ClientLayout title="Profile">
        <LoadingContent />
      </ClientLayout>
    ) : (
      <AuthLayout title="Profile">
        <LoadingContent />
      </AuthLayout>
    );
  }

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
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#1e786c] hover:bg-[#1a6b60]"
                >
                  <Save size={16} />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  disabled={saving}
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
                    {userData.first_name && userData.last_name 
                      ? `${userData.first_name.charAt(0)}${userData.last_name.charAt(0)}`.toUpperCase()
                      : userData.name 
                        ? userData.name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2).toUpperCase()
                        : 'U'
                    }
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
                    disabled={uploadingPicture}
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
                  htmlFor="first_name"
                  className="block text-sm font-bold text-[#1e786c] mb-1"
                >
                  First Name
                </label>
                <Input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={userData.first_name || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="border-[#cfab3d] focus:ring-[#1e786c] disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-bold text-[#1e786c] mb-1"
                >
                  Last Name
                </label>
                <Input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={userData.last_name || ""}
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
                  value={userData.age || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="border-[#cfab3d] focus:ring-[#1e786c] disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label
                  htmlFor="contact_number"
                  className="block text-sm font-bold text-[#1e786c] mb-1"
                >
                  Contact Number
                </label>
                <Input
                  type="tel"
                  id="contact_number"
                  name="contact_number"
                  value={userData.contact_number || ""}
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
                  value={userData.address || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="border-[#cfab3d] focus:ring-[#1e786c] disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label
                  htmlFor="emergency_contact_name"
                  className="block text-sm font-bold text-[#1e786c] mb-1"
                >
                  Emergency Contact Name
                </label>
                <Input
                  type="text"
                  id="emergency_contact_name"
                  name="emergency_contact_name"
                  value={userData.emergency_contact_name || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="border-[#cfab3d] focus:ring-[#1e786c] disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label
                  htmlFor="emergency_contact_phone"
                  className="block text-sm font-bold text-[#1e786c] mb-1"
                >
                  Emergency Contact Number
                </label>
                <Input
                  type="tel"
                  id="emergency_contact_phone"
                  name="emergency_contact_phone"
                  value={userData.emergency_contact_phone || ""}
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
                disabled={saving}
                className="bg-gradient-to-r from-[#1e786c] to-[#cfab3d] text-white font-bold px-8 py-3 rounded-full hover:scale-105 hover:shadow-lg transition"
              >
                {saving ? "Saving Profile..." : "Save Profile"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
