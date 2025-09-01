import type { LoginData, RegisterData, Task } from "@/types/type";
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
  logout: () => Promise.resolve({ data: { message: "Logged out" } }), // Simple logout for now
  getUser: () => {
    // Since your backend doesn't have a /user endpoint, we'll use stored user data
    const user = localStorage.getItem("user");
    if (user) {
      return Promise.resolve({ data: JSON.parse(user) });
    }
    return Promise.reject(new Error("No user found"));
  },
};

export const taskAPI = {
  getTasks: () => api.get<Task[]>("/tasks"),
  getTask: (id: number) => api.get<Task>(`/tasks/${id}`),
  createTask: (data: Partial<Task>) => api.post<Task>("/tasks", data),
  updateTask: (id: number, data: Partial<Task>) =>
    api.put<Task>(`/tasks/${id}`, data),
  deleteTask: (id: number) => api.delete(`/tasks/${id}`),
};

// User Management API (Admin only)
export const userManagementAPI = {
  getUsers: (params?: { search?: string; user_type?: string; is_active?: boolean; page?: number }) => 
    api.get("/admin/users", { params }),
  createUser: (data: any) => api.post("/admin/users", data),
  updateUser: (id: number, data: any) => api.put(`/admin/users/${id}`, data),
  toggleUserStatus: (id: number) => api.patch(`/admin/users/${id}/toggle-status`),
  deleteUser: (id: number) => api.delete(`/admin/users/${id}`),
};

export default api;
