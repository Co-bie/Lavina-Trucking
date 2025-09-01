import { useLocation } from "wouter";
import { useEffect, useRef } from "react";

export const useNavigationHistory = () => {
  const [location, setLocation] = useLocation();
  const previousLocation = useRef<string>("");

  useEffect(() => {
    // Store the previous location
    if (location !== "/login" && location !== "/register") {
      previousLocation.current = location;
    }
  }, [location]);

  const goBack = () => {
    // Use browser's back button functionality
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback to dashboard if no history
      setLocation("/dashboard");
    }
  };

  const navigateWithHistory = (path: string) => {
    // Use pushState instead of replace to maintain history
    setLocation(path);
  };

  return {
    location,
    setLocation: navigateWithHistory,
    goBack,
    previousLocation: previousLocation.current,
  };
};
