import { useEffect, useState } from "react";
import PageLoader from "../components/PageLoader";
import BackgroundBlobs from "../components/BackgroundBlobs";
import Header from "../components/LandingPage/Header";
import Hero from "../components/LandingPage/Hero";
import Testimonials from "../components/LandingPage/Testimonials";
import CTA from "../components/LandingPage/CTA";
import Footer from "../components/LandingPage/footer/Footer";

const Landingpage = () => {
  // Check if already visited in this tab
  const [loading, setLoading] = useState(() => {
    const isVisited = sessionStorage.getItem("isVisited");
    return !isVisited;
  });

  useEffect(() => {
    if (loading) {
      sessionStorage.setItem("isVisited", "true");
      const timer = setTimeout(() => setLoading(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <div className="min-h-screen bg-[#080b11] text-white relative select-none">
      {loading && (
        <div className="fixed inset-0 bg-[#080b11] flex items-center justify-center z-[9999]">
          <PageLoader />
        </div>
      )}

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

export default Landingpage;
