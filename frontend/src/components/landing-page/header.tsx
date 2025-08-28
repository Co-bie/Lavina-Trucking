import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export default function LandingPageHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);

    handleScroll();
    checkMobile();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-700 ${
        scrolled
          ? "bg-black/90 backdrop-blur-xl shadow-2xl py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="flex items-center space-x-2 sm:space-x-3 group"
          >
            <span className="sr-only">Logo</span>
            <img
              src="/logo.jpg"
              alt=""
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl"
            />
          </a>

          <nav className="flex items-center space-x-2 sm:space-x-4">
            <Button className="relative overflow-hidden bg-gradient-to-r from-[#1e786c] to-[#cfab3d] text-white font-bold px-4 sm:px-8 py-2 sm:py-3 rounded-full border-2 border-[#cfab3d] hover:border-[#cfab3d] transition-all duration-500 hover:scale-105 hover:shadow-[0_0_15px_#cfab3d] group">
              <a href="/register">
                <span className="relative z-10 text-sm sm:text-base">
                  Sign Up
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#cfab3d] to-[#1e786c] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </a>
            </Button>
            {!isMobile && (
              <Button className="relative overflow-hidden bg-white/10 backdrop-blur-md text-white font-bold px-4 sm:px-8 py-2 sm:py-3 rounded-full border-2 border-white hover:border-white hover:bg-white hover:text-[#1e786c] transition-all duration-500 hover:scale-105 hover:shadow-[0_0_15px_white] group">
                <a href="/login">
                  <span className="relative z-10 group-hover:text-[#1e786c] transition-colors duration-300 text-sm sm:text-base">
                    Login
                  </span>
                </a>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
