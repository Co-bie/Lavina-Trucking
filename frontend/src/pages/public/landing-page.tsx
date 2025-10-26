import LandingPageHeader from "../../components/landing-page/header";
import HeroSection from "../../components/landing-page/hero-section";

import AboutUs from "../../components/landing-page/about-us";
import Footer from "../../components/landing-page/footer";
// Main Landing Page Component
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <LandingPageHeader />
      <HeroSection />
      <AboutUs />
      <Footer />
    </div>
  );
}
