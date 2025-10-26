const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export interface Trip {
  id: number;
  trip_code: string;
  trip_date: string;
  client_name: string;
  client_contact: string;
  client_email: string;
  departure_point: string;
  destination: string;
  route_notes?: string;
  goods_description: string;
  cargo_weight: string;
  cargo_type:
    | "general"
    | "fragile"
    | "perishable"
    | "hazardous"
    | "heavy"
    | "temperature_controlled";
  truck_id: number;
  driver_id?: number;
  status: "pending" | "assigned" | "in_progress" | "completed" | "cancelled";
  estimated_cost: string;
  actual_cost?: string;
  estimated_departure_time: string;
  estimated_arrival_time: string;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
  truck: {
    id: number;
    truck_number: string;
    model: string;
    plate_number: string;
    color: string;
    year: number;
    status: string;
  };
  driver?: {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    license_number?: string;
  };
}

export interface CreateTripData {
  trip_date: string;
  client_name: string;
  client_contact: string;
  client_email: string;
  departure_point: string;
  destination: string;
  route_notes?: string;
  goods_description: string;
  cargo_weight: string;
  cargo_type: string;
  truck_id: number;
  estimated_cost: string;
  estimated_departure_time: string;
  estimated_arrival_time: string;
  special_instructions?: string;
}

export interface AssignDriverData {
  driver_id: number;
}

class TripsAPI {
  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getTrips(): Promise<{ success: boolean; data: Trip[] }> {
    return this.fetchWithAuth("/trips");
  }

  async getDriverTrips(
    driverId: number
  ): Promise<{ success: boolean; data: Trip[]; driver: any }> {
    return this.fetchWithAuth(`/drivers/${driverId}/trips`);
  }

  async getTrip(id: number): Promise<{ success: boolean; data: Trip }> {
    return this.fetchWithAuth(`/trips/${id}`);
  }

  async createTrip(
    tripData: CreateTripData
  ): Promise<{ success: boolean; data: Trip }> {
    return this.fetchWithAuth("/trips", {
      method: "POST",
      body: JSON.stringify(tripData),
    });
  }

  async updateTrip(
    id: number,
    tripData: Partial<CreateTripData>
  ): Promise<{ success: boolean; data: Trip }> {
    return this.fetchWithAuth(`/trips/${id}`, {
      method: "PUT",
      body: JSON.stringify(tripData),
    });
  }

  async deleteTrip(id: number): Promise<{ success: boolean; message: string }> {
    return this.fetchWithAuth(`/trips/${id}`, {
      method: "DELETE",
    });
  }

  async assignDriver(
    tripId: number,
    driverId: number
  ): Promise<{ success: boolean; data: Trip }> {
    return this.fetchWithAuth(`/trips/${tripId}/assign-driver`, {
      method: "PUT",
      body: JSON.stringify({ driver_id: driverId }),
    });
  }

  async unassignDriver(
    tripId: number
  ): Promise<{ success: boolean; data: Trip }> {
    return this.fetchWithAuth(`/trips/${tripId}/unassign-driver`, {
      method: "POST",
    });
  }

  async createSampleTrips(): Promise<{
    success: boolean;
    message: string;
    data: Trip[];
  }> {
    return this.fetchWithAuth("/create-sample-trips", {
      method: "POST",
    });
  }
}

export const tripsAPI = new TripsAPI();
