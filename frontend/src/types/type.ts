export type User = {
  id: number;
  name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  user_type?: 'admin' | 'driver' | 'client';
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  hourly_rate?: number;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateUserData = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  user_type: 'admin' | 'driver' | 'client';
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  hourly_rate?: number;
};

export type UpdateUserData = Partial<Omit<CreateUserData, 'password'>> & {
  password?: string;
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
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
};
