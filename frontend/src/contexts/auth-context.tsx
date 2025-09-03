import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { authAPI } from "../services/api";
import type { User } from "@/types/type";
<<<<<<< HEAD
=======

>>>>>>> cc024f2abfab9c996eb85828c3eb46cc1f7a6b20
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => Promise<void>;
  logout: () => void;
<<<<<<< HEAD
=======
  isAuthenticated: boolean;
>>>>>>> cc024f2abfab9c996eb85828c3eb46cc1f7a6b20
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      authAPI
        .getUser()
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
<<<<<<< HEAD
    const response = await authAPI.login({ email, password });
    const { user, token } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
=======
    try {
      const response = await authAPI.login({ email, password });
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
>>>>>>> cc024f2abfab9c996eb85828c3eb46cc1f7a6b20
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => {
<<<<<<< HEAD
    const response = await authAPI.register({
      name,
      email,
      password,
      password_confirmation,
    });
    const { user, token } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
=======
    try {
      // Split name into first and last name for backend compatibility
      const nameParts = name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const response = await authAPI.register({
        name,
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        password_confirmation,
      });
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
>>>>>>> cc024f2abfab9c996eb85828c3eb46cc1f7a6b20
  };

  const logout = () => {
    authAPI.logout().catch(() => {});
    localStorage.removeItem("token");
    localStorage.removeItem("user");
<<<<<<< HEAD
    setUser(null);
=======
    sessionStorage.removeItem("redirectAfterLogin");
    setUser(null);
    
    // Use window.location.href to properly navigate to login
    // This maintains browser history better than programmatic navigation
    window.location.href = "/login";
>>>>>>> cc024f2abfab9c996eb85828c3eb46cc1f7a6b20
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
<<<<<<< HEAD
=======
    isAuthenticated: !!user,
>>>>>>> cc024f2abfab9c996eb85828c3eb46cc1f7a6b20
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
