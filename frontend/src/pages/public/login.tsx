import { useAuth } from "@/contexts/auth-context";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useState } from "react";
import { useLocation } from "wouter";
import { Loader2, AlertCircle, ShieldOff, User } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const getErrorIcon = () => {
    switch (errorType) {
      case 'account_blocked':
        return <ShieldOff className="w-5 h-5 text-red-600" />;
      case 'user_not_found':
        return <User className="w-5 h-5 text-red-600" />;
      case 'invalid_password':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getErrorStyles = () => {
    switch (errorType) {
      case 'account_blocked':
        return "bg-red-50 border-red-200 text-red-800";
      case 'user_not_found':
        return "bg-orange-50 border-orange-200 text-orange-800";
      case 'invalid_password':
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      default:
        return "bg-red-50 border-red-200 text-red-800";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrorType("");
    setLoading(true);

    try {
      await login(email, password);
      setLocation("/home");
    } catch (err: any) {
      // Extract error information from the error response
      if (err.message) {
        setError(err.message);
        
        // Determine error type based on message content
        if (err.message.includes("blocked")) {
          setErrorType("account_blocked");
        } else if (err.message.includes("No account found")) {
          setErrorType("user_not_found");
        } else if (err.message.includes("password")) {
          setErrorType("invalid_password");
        } else {
          setErrorType("general");
        }
      } else {
        setError("An unknown error occurred");
        setErrorType("general");
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
          <div className={`mb-4 rounded-lg px-4 py-3 text-sm border flex items-center gap-3 ${getErrorStyles()}`}>
            {getErrorIcon()}
            <div>
              <div className="font-medium">{error}</div>
              {errorType === 'account_blocked' && (
                <div className="text-xs mt-1 opacity-80">
                  Contact your administrator to reactivate your account.
                </div>
              )}
              {errorType === 'user_not_found' && (
                <div className="text-xs mt-1 opacity-80">
                  Please check your email address or sign up for a new account.
                </div>
              )}
              {errorType === 'invalid_password' && (
                <div className="text-xs mt-1 opacity-80">
                  Please double-check your password and try again.
                </div>
              )}
            </div>
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
