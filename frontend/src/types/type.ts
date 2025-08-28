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
