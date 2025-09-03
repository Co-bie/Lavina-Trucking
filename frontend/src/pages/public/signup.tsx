import { useState } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useAuth } from "@/contexts/auth-context";

export function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await register(name, email, password, confirmPassword);
      setLocation("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "An error occurred during registration");
      } else {
        setError("An unknown error occurred");
        console.log(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-secondary via-white to-secondary/20">
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/30 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md rounded-2xl shadow-2xl p-8 bg-gradient-to-br from-[#cfab3d]/80 via-white/90 to-[#1e786c]/80 border border-[#cfab3d]/30">
        <h3 className="mb-6 text-3xl font-black text-center bg-gradient-to-r from-[#cfab3d] via-[#1e786c] to-[#cfab3d] bg-clip-text text-transparent">
          Sign Up
        </h3>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-3 text-sm border border-red-300">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              className="bg-white"
            />
          </div>

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

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-1"
            >
              Confirm Password
            </label>
            <Input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                Signing up...
              </span>
            ) : (
              "Sign Up"
            )}
          </Button>

          <p className="text-center text-sm text-gray-700 mt-4">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#cfab3d] font-semibold hover:underline"
            >
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
