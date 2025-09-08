import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Shield, 
  ShieldOff
} from "lucide-react";
import { userManagementAPI } from "@/services/api";
import type { User, CreateUserData } from "@/types/type";
import AuthLayout from "@/components/shared/auth-layout";
import AdminRoute from "@/components/shared/admin-route";

interface UserManagementProps {
  // No props needed - using browser navigation
}

export default function UserManagement({}: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("");
  const [filterActive, setFilterActive] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState<CreateUserData>({
    name: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    user_type: "client",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    hourly_rate: undefined,
  });

  // Check if user is admin, redirect if not
  useEffect(() => {
    if (user && user.user_type !== 'admin') {
      setLocation('/dashboard');
    }
  }, [user, setLocation]);

  // Show access denied if not admin
  if (!user || user.user_type !== 'admin') {
    return (
      <AuthLayout title="Access Denied">
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access the User Management system.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Only administrators can manage users. Please contact your system administrator if you need access.
          </p>
          <Button 
            onClick={() => setLocation('/dashboard')}
            className="bg-[#1e786c] hover:bg-[#1a6b60] text-white"
          >
            Return to Dashboard
          </Button>
        </div>
      </AuthLayout>
    );
  }

  const [formData, setFormData] = useState<CreateUserData>({
    name: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    user_type: "client",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    hourly_rate: undefined,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: any = { page: currentPage };
      
      if (searchTerm) params.search = searchTerm;
      if (filterType) params.user_type = filterType;
      if (filterActive !== "") params.is_active = filterActive === "true";

      const response = await userManagementAPI.getUsers(params);
      
      // Handle the API response format { success: true, data: ... }
      if (response.data.success) {
        setUsers(response.data.data.data || []);
        setTotalPages(response.data.data.last_page || 1);
      } else {
        console.error("API returned success: false");
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, filterType, filterActive]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Don't send 'name' field - backend will generate it from first_name + last_name
      const { name, ...createData } = formData;
      const response = await userManagementAPI.createUser(createData);
      
      if (response.data.success) {
        alert("User created successfully!");
        setShowCreateModal(false);
        resetForm();
        fetchUsers();
      } else {
        alert("Failed to create user");
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
      alert(error.response?.data?.message || "Failed to create user");
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      // Don't send 'name' field - backend will generate it from first_name + last_name
      const { name, ...updateData } = formData;
      
      // Create update payload
      const payload: any = { ...updateData };
      if (!payload.password) {
        delete payload.password;
      }
      
      const response = await userManagementAPI.updateUser(selectedUser.id, payload);
      
      if (response.data.success) {
        alert("User updated successfully!");
        setShowEditModal(false);
        setSelectedUser(null);
        resetForm();
        fetchUsers();
      } else {
        alert("Failed to update user");
      }
    } catch (error: any) {
      console.error("Error updating user:", error);
      alert(error.response?.data?.message || "Failed to update user");
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      const response = await userManagementAPI.toggleUserStatus(user.id);
      
      if (response.data.success) {
        alert(`User ${user.is_active ? 'blocked' : 'activated'} successfully!`);
        fetchUsers();
      } else {
        alert("Failed to update user status");
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      alert("Failed to update user status");
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await userManagementAPI.deleteUser(user.id);
      
      if (response.data.success) {
        alert("User deleted successfully!");
        fetchUsers();
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email,
      password: "",
      user_type: user.user_type || "client",
      phone: user.phone || "",
      address: user.address || "",
      city: user.city || "",
      state: user.state || "",
      zip_code: user.zip_code || "",
      hourly_rate: user.hourly_rate,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      user_type: "client",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      hourly_rate: undefined,
    });
  };

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case 'admin': return 'text-red-600 bg-red-100';
      case 'driver': return 'text-blue-600 bg-blue-100';
      case 'client': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <AuthLayout title="User Management">
      <div className="space-y-6">
        {/* Header with Create Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Manage System Users</h2>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create User
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Button type="submit" size="sm">
                <Search className="w-4 h-4" />
              </Button>
            </form>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="admin">Admin</option>
              <option value="driver">Driver</option>
              <option value="client">Client</option>
            </select>

            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Blocked</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">Loading users...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUserTypeColor(user.user_type || 'client')}`}>
                            {user.user_type || 'client'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.phone || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.is_active 
                              ? 'text-green-800 bg-green-100 border border-green-200' 
                              : 'text-red-800 bg-red-100 border border-red-200 animate-pulse'
                          }`}>
                            {user.is_active ? '✓ Active' : '✗ Blocked'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <Button
                              onClick={() => openEditModal(user)}
                              size="sm"
                              variant="outline"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleToggleStatus(user)}
                              size="sm"
                              variant={!user.is_active ? "destructive" : "success"}
                              className={!user.is_active ? 
                                "bg-red-600 hover:bg-red-700 text-white shadow-lg" : 
                                "bg-green-600 hover:bg-green-700 text-white shadow-lg"
                              }
                              title={user.is_active ? "Block User" : "Unblock User"}
                            >
                              {user.is_active ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                            </Button>
                            <Button
                              onClick={() => handleDeleteUser(user)}
                              size="sm"
                              variant="destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-3 border-t border-gray-200 flex justify-between items-center">
                  <div className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      size="sm"
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      size="sm"
                      variant="outline"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Create New User</h2>
              <form onSubmit={handleCreateUser} className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  required
                />
                <Input
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="col-span-2"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  className="col-span-2"
                />
                <select
                  value={formData.user_type}
                  onChange={(e) => setFormData({...formData, user_type: e.target.value as any})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-2"
                  required
                >
                  <option value="client">Client</option>
                  <option value="driver">Driver</option>
                  <option value="admin">Admin</option>
                </select>
                <Input
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
                <Input
                  placeholder="Hourly Rate"
                  type="number"
                  step="0.01"
                  value={formData.hourly_rate || ''}
                  onChange={(e) => setFormData({...formData, hourly_rate: e.target.value ? parseFloat(e.target.value) : undefined})}
                />
                <Input
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="col-span-2"
                />
                <Input
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
                <Input
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                />
                <Input
                  placeholder="ZIP Code"
                  value={formData.zip_code}
                  onChange={(e) => setFormData({...formData, zip_code: e.target.value})}
                />
                
                <div className="col-span-2 flex gap-2 justify-end mt-4">
                  <Button type="button" variant="outline" onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit">Create User</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Edit User</h2>
              <form onSubmit={handleUpdateUser} className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  required
                />
                <Input
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="col-span-2"
                />
                <Input
                  type="password"
                  placeholder="Password (leave blank to keep current)"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="col-span-2"
                />
                <select
                  value={formData.user_type}
                  onChange={(e) => setFormData({...formData, user_type: e.target.value as any})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-2"
                  required
                >
                  <option value="client">Client</option>
                  <option value="driver">Driver</option>
                  <option value="admin">Admin</option>
                </select>
                <Input
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
                <Input
                  placeholder="Hourly Rate"
                  type="number"
                  step="0.01"
                  value={formData.hourly_rate || ''}
                  onChange={(e) => setFormData({...formData, hourly_rate: e.target.value ? parseFloat(e.target.value) : undefined})}
                />
                <Input
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="col-span-2"
                />
                <Input
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
                <Input
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                />
                <Input
                  placeholder="ZIP Code"
                  value={formData.zip_code}
                  onChange={(e) => setFormData({...formData, zip_code: e.target.value})}
                />
                
                <div className="col-span-2 flex gap-2 justify-end mt-4">
                  <Button type="button" variant="outline" onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit">Update User</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
