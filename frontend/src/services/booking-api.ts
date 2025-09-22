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

export interface BookingData {
  trip_date: string;
  client_name: string;
  client_contact: string;
  client_email: string;
  departure_point: string;
  destination: string;
  goods_description: string;
  cargo_weight: number;
  cargo_type: string;
  truck_id: number;
  estimated_departure_time: string;
  estimated_arrival_time: string;
  special_instructions: string;
  route_notes: string;
}

export const bookingAPI = {
  createBooking: (data: BookingData) => api.post("/bookings", data),
  getMyBookings: () => api.get("/my-bookings"),
  getAvailableTrucks: () => api.get("/trucks/available"),
};