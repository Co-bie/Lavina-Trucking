import { useAuth } from "@/contexts/auth-context";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useState } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      
      // Check if there's a stored redirect location
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      if (redirectPath && redirectPath !== "/login") {
        sessionStorage.removeItem("redirectAfterLogin");
        setLocation(redirectPath);
      } else {
        setLocation("/dashboard");
      }
    } catch (err: any) {
      console.error("Login error details:", err);
      
      if (err.response) {
        // Handle Laravel validation errors
        if (err.response.data?.errors) {
          const errors = err.response.data.errors;
          // Get the first error message from validation errors
          const firstError = Object.values(errors)[0];
          setError(Array.isArray(firstError) ? firstError[0] : firstError);
        } else {
          setError(err.response.data?.message || `Server error: ${err.response.status}`);
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError("Network error: Unable to connect to server. Please check if the backend is running.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(err.message || "An error occurred during login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-secondary/20 via-white to-secondary">
      <div className="absolute top-10 left-10 w-72 h-72 bg-secondary/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/30 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md rounded-2xl shadow-2xl p-8 bg-gradient-to-br from-[#cfab3d]/80 via-white/90 to-[#1e786c]/80 border border-[#cfab3d]/30">
        <h3 className="mb-6 text-3xl font-black text-center bg-gradient-to-r from-[#cfab3d] via-[#1e786c] to-[#cfab3d] bg-clip-text text-transparent">
          Login
        </h3>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-3 text-sm border border-red-300">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="bg-white"
            />
          </div>

          <Button
            className="w-full bg-[#1e786c] hover:bg-[#cfab3d] text-white font-bold py-2 rounded-full transition-colors duration-300 shadow-md"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </Button>

          <p className="text-center text-sm text-gray-700 mt-4">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="text-[#cfab3d] font-semibold hover:underline"
            >
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
