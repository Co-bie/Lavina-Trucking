import React, { useState, useEffect } from 'react';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    first_name: '',
    last_name: '',
    age: '',
    contact_number: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    date_of_birth: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    license_number: '',
    license_class: '',
    license_expiry: '',
    endorsements: ''
  });
  
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Load user profile on component mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to home if not authenticated
        window.location.href = '/';
        return;
      }

      // Try to decode token to get user info (simple demo approach)
      try {
        const tokenParts = atob(token).split('|');
        const userId = tokenParts[0];
        
        // Fetch the specific user's profile
        const response = await fetch(`http://localhost:8000/api/profile/${userId}`);
        const result = await response.json();
        
        if (result.success) {
          const userData = result.data;
          setUser(userData);
          setFormData({
            name: userData.name || '',
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            age: userData.age || '',
            contact_number: userData.contact_number || '',
            phone: userData.phone || '',
            address: userData.address || '',
            city: userData.city || '',
            state: userData.state || '',
            zip_code: userData.zip_code || '',
            date_of_birth: userData.date_of_birth || '',
            emergency_contact_name: userData.emergency_contact_name || '',
            emergency_contact_phone: userData.emergency_contact_phone || '',
            emergency_contact_relationship: userData.emergency_contact_relationship || '',
            license_number: userData.license_number || '',
            license_class: userData.license_class || '',
            license_expiry: userData.license_expiry || '',
            endorsements: userData.endorsements || ''
          });
          
          if (userData.profile_picture) {
            setPreviewImage(`http://localhost:8000/storage/profile_pictures/${userData.profile_picture}`);
          }
        } else {
          throw new Error('Failed to load user profile');
        }
      } catch (tokenError) {
        // If token is invalid, fall back to fetching first user (for demo)
        console.log('Token invalid, using demo user');
        const response = await fetch('http://localhost:8000/api/users');
        const users = await response.json();
        
        if (users && users.length > 0) {
          const userData = users[0];
          setUser(userData);
          setFormData({
            name: userData.name || '',
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            age: userData.age || '',
            contact_number: userData.contact_number || '',
            phone: userData.phone || '',
            address: userData.address || '',
            city: userData.city || '',
            state: userData.state || '',
            zip_code: userData.zip_code || '',
            date_of_birth: userData.date_of_birth || '',
            emergency_contact_name: userData.emergency_contact_name || '',
            emergency_contact_phone: userData.emergency_contact_phone || '',
            emergency_contact_relationship: userData.emergency_contact_relationship || '',
            license_number: userData.license_number || '',
            license_class: userData.license_class || '',
            license_expiry: userData.license_expiry || '',
            endorsements: userData.endorsements || ''
          });
          
          if (userData.profile_picture) {
            setPreviewImage(`http://localhost:8000/storage/profile_pictures/${userData.profile_picture}`);
          }
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      alert('Failed to load profile. Please try logging in again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      let updateSuccess = false;
      
      // First, update the profile data (without file)
      const profileData = {
        user_id: user.id,
        ...formData
      };

      console.log('Sending profile data:', profileData);
      console.log('Form data details:', {
        keys: Object.keys(formData),
        values: Object.values(formData),
        nonEmptyFields: Object.entries(formData).filter(([key, value]) => value && value.trim() !== '')
      });

      const profileResponse = await fetch('http://localhost:8000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const profileResult = await profileResponse.json();
      console.log('Profile update response:', profileResult);

      if (profileResult.success) {
        updateSuccess = true;
        setUser(profileResult.data);
      } else {
        console.error('Profile update failed:', profileResult);
        if (profileResult.errors) {
          setErrors(profileResult.errors);
        } else {
          alert(profileResult.message || 'Failed to update profile');
          return;
        }
      }

      // If there's a profile picture, upload it separately
      if (profilePicture && updateSuccess) {
        const formDataPicture = new FormData();
        formDataPicture.append('profile_picture', profilePicture);
        formDataPicture.append('user_id', user.id);

        const pictureResponse = await fetch('http://localhost:8000/api/profile/picture', {
          method: 'POST',
          body: formDataPicture,
        });

        const pictureResult = await pictureResponse.json();
        console.log('Picture upload response:', pictureResult);

        if (!pictureResult.success) {
          console.error('Picture upload failed:', pictureResult);
          alert('Profile updated but picture upload failed: ' + (pictureResult.message || 'Unknown error'));
        }
      }

      if (updateSuccess) {
        setIsEditing(false);
        alert('Profile updated successfully!');
        // Reload the profile to get updated data
        loadUserProfile();
      }

    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again. Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Test function to debug API calls
  const testApiUpdate = async () => {
    try {
      console.log('Testing API update...');
      const response = await fetch('http://localhost:8000/api/test-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: 'data' })
      });
      
      const result = await response.json();
      console.log('Test API response:', result);
      alert('Test API response: ' + JSON.stringify(result));
    } catch (error) {
      console.error('Test API error:', error);
      alert('Test API error: ' + error.message);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original user data
    if (user) {
      setFormData({
        name: user.name || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        age: user.age || '',
        contact_number: user.contact_number || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zip_code: user.zip_code || '',
        date_of_birth: user.date_of_birth || '',
        emergency_contact_name: user.emergency_contact_name || '',
        emergency_contact_phone: user.emergency_contact_phone || '',
        emergency_contact_relationship: user.emergency_contact_relationship || '',
        license_number: user.license_number || '',
        license_class: user.license_class || '',
        license_expiry: user.license_expiry || '',
        endorsements: user.endorsements || ''
      });
      
      if (user.profile_picture) {
        setPreviewImage(`http://localhost:8000/storage/profile_pictures/${user.profile_picture}`);
      }
    }
    setErrors({});
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 via-green-500 to-teal-600 text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center text-white hover:text-gray-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <div></div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          
          {/* Profile Picture and Basic Info */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {previewImage ? (
                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl text-gray-500">
                      {formData.first_name ? formData.first_name.charAt(0).toUpperCase() : 'U'}
                      {formData.last_name ? formData.last_name.charAt(0).toUpperCase() : 'S'}
                    </span>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">Profile Picture</p>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-gray-600 capitalize">{user.user_type || 'Client'}</p>
              <p className="text-gray-500">{user.email}</p>
              
              <div className="mt-4">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-yellow-400 via-green-500 to-teal-600 text-white px-6 py-2 rounded-md hover:opacity-90"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="bg-gradient-to-r from-yellow-400 via-green-500 to-teal-600 text-white px-6 py-2 rounded-md hover:opacity-90 disabled:opacity-50 flex items-center"
                    >
                      {loading && (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={loading}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                
                {/* Debug Test Button */}
                <button
                  onClick={testApiUpdate}
                  className="mt-2 bg-red-500 text-white px-4 py-1 rounded text-sm hover:bg-red-600"
                >
                  Test API
                </button>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Personal Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your first name"
                    />
                  ) : (
                    <p className="py-2 text-gray-800">{user.first_name || 'Not provided'}</p>
                  )}
                  {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your last name"
                    />
                  ) : (
                    <p className="py-2 text-gray-800">{user.last_name || 'Not provided'}</p>
                  )}
                  {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your age"
                      min="18"
                      max="100"
                    />
                  ) : (
                    <p className="py-2 text-gray-800">{user.age || 'Not provided'}</p>
                  )}
                  {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="contact_number"
                      value={formData.contact_number}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+1 (XXX) XXX-XXXX"
                    />
                  ) : (
                    <p className="py-2 text-gray-800">{user.contact_number || 'Not provided'}</p>
                  )}
                  {errors.contact_number && <p className="text-red-500 text-sm mt-1">{errors.contact_number[0]}</p>}
                </div>
              </div>

              {/* Address */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full address"
                  />
                ) : (
                  <p className="py-2 text-gray-800">{user.address || 'Not provided'}</p>
                )}
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address[0]}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="City"
                    />
                  ) : (
                    <p className="py-2 text-gray-800">{user.city || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="State"
                    />
                  ) : (
                    <p className="py-2 text-gray-800">{user.state || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="zip_code"
                      value={formData.zip_code}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ZIP"
                    />
                  ) : (
                    <p className="py-2 text-gray-800">{user.zip_code || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Emergency Contact</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="emergency_contact_name"
                      value={formData.emergency_contact_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Full name"
                    />
                  ) : (
                    <p className="py-2 text-gray-800">{user.emergency_contact_name || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="emergency_contact_phone"
                      value={formData.emergency_contact_phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+1 (XXX) XXX-XXXX"
                    />
                  ) : (
                    <p className="py-2 text-gray-800">{user.emergency_contact_phone || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="emergency_contact_relationship"
                    value={formData.emergency_contact_relationship}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Spouse, Parent, Sibling"
                  />
                ) : (
                  <p className="py-2 text-gray-800">{user.emergency_contact_relationship || 'Not provided'}</p>
                )}
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
