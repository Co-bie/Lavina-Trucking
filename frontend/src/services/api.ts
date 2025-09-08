import type { LoginData, RegisterData, Task, CreateUserData, UpdateUserData, User, Truck } from "@/types/type";
import axios from "axios";

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data: LoginData) => api.post("/login", data),
  register: (data: RegisterData) => api.post("/register", data),
  logout: () => api.post("/logout"),
  getUser: () => api.get("/user"),
};

export const taskAPI = {
  getTasks: () => api.get("/tasks"),
  getTask: (id: number) => api.get(`/tasks/${id}`),
  createTask: (data: Partial<Task>) => api.post("/tasks", data),
  updateTask: (id: number, data: Partial<Task>) => api.put(`/tasks/${id}`, data),
  deleteTask: (id: number) => api.delete(`/tasks/${id}`),
};

// User Management API
export const userManagementAPI = {
  getUsers: (params?: any) => api.get("/admin/users", { params }),
  createUser: (data: CreateUserData) => api.post("/admin/users", data),
  updateUser: (id: number, data: UpdateUserData) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id: number) => api.delete(`/admin/users/${id}`),
  blockUser: (id: number) => api.patch(`/admin/users/${id}/block`),
  unblockUser: (id: number) => api.patch(`/admin/users/${id}/unblock`),
  toggleUserStatus: (id: number) => api.patch(`/admin/users/${id}/toggle-status`),
};

// Profile API
export const profileAPI = {
  getProfile: (userId?: number) => {
    const params = userId ? { user_id: userId } : {};
    return api.get("/profile", { params });
  },
  updateProfile: (data: any) => api.patch("/profile", data),
  uploadProfilePicture: (file: File, userId?: number) => {
    const formData = new FormData();
    formData.append('profile_picture', file);
    if (userId) {
      formData.append('user_id', userId.toString());
    }
    return api.post("/profile/upload-picture", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Drivers API
export const driversAPI = {
  getDrivers: () => api.get("/drivers"),
  getDriver: (id: number) => api.get(`/drivers/${id}`),
  updateDriver: (id: number, data: Partial<User>) => api.put(`/drivers/${id}`, data),
};

// Trucks API
export const trucksAPI = {
  getTrucks: () => api.get("/trucks"),
  getTruck: (id: number) => api.get(`/trucks/${id}`),
};

export default api;
