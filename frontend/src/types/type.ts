export type User = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed";
  due_date?: string;
  created_at: string;
  updated_at: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type ScheduleType = {
  id: string;
  date: string;
  time: string;
  locations: {
    departure_point: string;
    destination: string;
  };
  goods: {
    item: string;
    weight_in_kgs: string;
  };
  truck_number: string;
};

export type Driver = {
  id: string;
  name: string;
  profile_image?: string;
  email: string;
  phone_number: string;
  date_of_birth?: string;

  license_number: string;
  license_expiry: string;
  license_type: "CDL-A" | "CDL-B" | "CDL-C" | "Non-CDL";
  endorsements: string[];
  years_experience: number;

  vehicle: {
    id: string;
    make: string;
    model: string;
    year: number;
    license_plate: string;
    vin?: string;
    vehicle_type:
      | "Semi-Truck"
      | "Box Truck"
      | "Van"
      | "Flatbed"
      | "Refrigerated";
    capacity: {
      weight: number;
      volume: number;
    };
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    features: string[];
    insurance: {
      policy_number: string;
      expiry_date: string;
      coverage_amount: number;
    };
  };

  ratings: {
    overall: number;
    total_reviews: number;
    breakdown: {
      punctuality: number;
      communication: number;
      safety: number;
      professionalism: number;
    };
    recent_reviews: Array<{
      id: string;
      rating: number;
      comment: string;
      reviewer_name: string;
      date: string;
      shipment_id: string;
    }>;
  };

  location: {
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    city: string;
    state: string;
    country: string;
    zip_code?: string;
    current_region?: string;
  };
  service_areas: string[];
  preferred_routes?: string[];

  isAvailable: boolean;
  isOnline: boolean;
  availability_schedule?: {
    days_available: string[];
    hours_available: {
      start: string;
      end: string;
    };
  };
  current_status?: "available" | "on_delivery" | "off_duty" | "break";
  estimated_availability_date?: string;

  stats: {
    total_shipments: number;
    on_time_deliveries: number;
    successful_deliveries: number;
    miles_driven: number;
    average_delivery_time: number;
    acceptance_rate: number;
  };

  documents: Array<{
    type:
      | "license"
      | "insurance"
      | "vehicle_registration"
      | "medical_certificate";
    url: string;
    expiry_date: string;
    verified: boolean;
  }>;
  background_check: {
    status: "pending" | "approved" | "rejected";
    completed_at?: string;
  };

  specializations: string[];
  languages: string[];
  payment_methods: string[];

  created_at: string;
  updated_at: string;
  last_online?: string;
  last_delivery_date?: string;

  badges?: string[];
  membership_tier?: "basic" | "premium" | "elite";
  referral_code?: string;

  contact_preferences: {
    sms_notifications: boolean;
    email_notifications: boolean;
    push_notifications: boolean;
  };
};

export type DriverStatus = "available" | "on_delivery" | "off_duty" | "break";
export type LicenseType = "CDL-A" | "CDL-B" | "CDL-C" | "Non-CDL";
export type VehicleType =
  | "Semi-Truck"
  | "Box Truck"
  | "Van"
  | "Flatbed"
  | "Refrigerated";
