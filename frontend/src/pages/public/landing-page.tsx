import LandingPageHeader from "../../components/landing-page/header";
import HeroSection from "../../components/landing-page/hero-section";

import AboutUs from "../../components/landing-page/about-us";
import Footer from "../../components/landing-page/footer";
// Main Landing Page Component
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-900 {
          animation-delay: 0.9s;
        }

        .animation-delay-1200 {
          animation-delay: 1.2s;
        }
      `}</style>

      <LandingPageHeader />
      <HeroSection />
      <AboutUs />
      <Footer />
    </div>
  );
}
