import { memo } from "react";
import BackgroundBlobs from "../components/BackgroundBlobs";
import Header from "../components/LandingPage/Header";
import Hero from "../components/LandingPage/Hero";
import Testimonials from "../components/LandingPage/Testimonials";
import CTA from "../components/LandingPage/CTA";
import Footer from "../components/LandingPage/footer/Footer";

const Landingpage = () => {
  return (
    <div className="min-h-screen bg-[#06080e] text-white relative select-none font-sans">
      {/* Background ambient flares */}
      <BackgroundBlobs />

      {/* Main Home Overview Components */}
      <Header />
      <Hero />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default memo(Landingpage);
