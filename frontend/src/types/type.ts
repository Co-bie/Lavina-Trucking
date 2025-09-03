export type User = {
  id: number;
  name: string;
<<<<<<< HEAD
  email: string;
=======
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
>>>>>>> cc024f2abfab9c996eb85828c3eb46cc1f7a6b20
  created_at: string;
  updated_at: string;
};

<<<<<<< HEAD
=======
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

>>>>>>> cc024f2abfab9c996eb85828c3eb46cc1f7a6b20
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
<<<<<<< HEAD
=======
  first_name: string;
  last_name: string;
>>>>>>> cc024f2abfab9c996eb85828c3eb46cc1f7a6b20
  email: string;
  password: string;
  password_confirmation: string;
};
<<<<<<< HEAD

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
=======
>>>>>>> cc024f2abfab9c996eb85828c3eb46cc1f7a6b20
