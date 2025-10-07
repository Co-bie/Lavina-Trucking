import { useEffect, useState } from "react";
import FloatingParticles from "./presents/floating-particles";
import { Shield, Zap, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [bookingId, setBookingId] = useState("");

  useEffect(() => {
    const handleMouseMove = (e: { clientX: number; clientY: number }) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    const checkMobile = () => setIsMobile(window.innerWidth < 768);

    checkMobile();
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleTrack = () => {
    if (!bookingId.trim()) return;
    alert(`Tracking booking ID: ${bookingId}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-10 sm:pt-48 sm:pb-20">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1e786c] to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#cfab3d_0%,transparent_50%)]" />
      </div>

      {/* Animated circles */}
      {!isMobile && (
        <>
          <div
            className="absolute w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-gradient-to-r from-[#1e786c] to-[#cfab3d] blur-xl sm:blur-3xl animate-spin"
            style={{
              transform: `translate(${mousePos.x * 0.02}px, ${
                mousePos.y * 0.02
              }px)`,
              left: "10%",
              top: "20%",
            }}
          />
          <div
            className="absolute w-56 h-56 sm:w-80 sm:h-80 rounded-full bg-gradient-to-r from-[#cfab3d] to-[#1e786c] blur-lg sm:blur-2xl animate-pulse"
            style={{
              transform: `translate(${-mousePos.x * 0.01}px, ${
                -mousePos.y * 0.01
              }px)`,
              right: "10%",
              bottom: "20%",
            }}
          />
        </>
      )}

      <FloatingParticles />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
        {/* Headings */}
        <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight">
            <span className="inline-block animate-fade-in-up text-[#cfab3d] hover:scale-105 transition-transform duration-500">
              Nonoy Lavina Trucking
            </span>
            <br />
            <span className="inline-block animate-fade-in-up animation-delay-300 text-[#cfab3d] hover:scale-105 transition-transform duration-500">
              Sand & Gravel
            </span>
          </h1>

          <p className="text-base sm:text-xl md:text-2xl text-gray-300 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-600">
            Driven by <span className="text-[#cfab3d] font-bold">passion</span>{" "}
            and <span className="text-[#1e786c] font-bold">purpose</span>, we
            connect communities through dependable transport solutions. For
            decades, we've been moving goods and building trust every mile of
            the way.
          </p>
        </div>

        {/* Track Your Shipping Input */}
        <div className="mt-8 sm:mt-12 flex justify-center animate-fade-in-up animation-delay-900">
          <div className="flex w-full max-w-md sm:max-w-lg items-center space-x-2 bg-black/40 border border-[#cfab3d] rounded-full p-1.5 backdrop-blur-md">
            <Input
              type="text"
              placeholder="Booking ID"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-gray-400"
            />
            <Button
              onClick={handleTrack}
              className="bg-[#cfab3d] text-black font-semibold hover:bg-[#b89630] rounded-full px-6"
            >
              <Search className="w-4 h-4 mr-1" /> Track
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 animate-fade-in-up animation-delay-1200">
          {[
            { icon: Shield, label: "Safe Delivery", value: "10K+" },
            { icon: Zap, label: "Years Experience", value: "25+" },
          ].map((stat, i) => (
            <div
              key={i}
              className="group p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-black backdrop-blur-md border border-[#cfab3d] hover:scale-105 hover:shadow-[0_0_20px_#cfab3d] transition-all duration-500"
            >
              <stat.icon className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-[#cfab3d] group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
              <div className="text-2xl sm:text-3xl font-black text-white mb-1 sm:mb-2">
                {stat.value}
              </div>
              <div className="text-sm sm:text-base text-gray-300 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!isMobile && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 sm:w-8 sm:h-12 rounded-full border-2 border-[#cfab3d] p-1 sm:p-2">
            <div className="w-1 h-2 sm:w-2 sm:h-3 bg-[#cfab3d] rounded-full mx-auto animate-pulse" />
          </div>
        </div>
      )}
    </section>
  );
}
