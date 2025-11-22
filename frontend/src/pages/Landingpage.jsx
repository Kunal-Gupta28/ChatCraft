import { useEffect, useState } from "react";
import PageLoader from "../components/LandingPage/PageLoader";
import Header from "../components/LandingPage/Header";
import Hero from "../components/LandingPage/Hero";
import Features from "../components/LandingPage/Features";
import HowItWorks from "../components/LandingPage/HowItWorks";
import Testimonials from "../components/LandingPage/Testimonials";
import CTA from "../components/LandingPage/CTA";
import Footer from "../components/LandingPage/Footer";

const Landingpage = () => {
  // Check if already visited in this tab
  const [loading, setLoading] = useState(() => {
    const isVisited = sessionStorage.getItem("isVisited");
    return !isVisited;  // true for first visit in current tab
  });

  useEffect(() => {
    if (loading) {
      // First visit only → mark session as visited
      sessionStorage.setItem("isVisited", "true");

      const timer = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <div
      className={`${
        loading ? "h-[100dvh]" : "min-h-screen"
      } bg-gray-950 text-white overflow-x-hidden relative`}
    >
      {loading && (
        <div className="fixed inset-0 bg-gray-950 flex items-center justify-center z-[9999]">
          <PageLoader />
        </div>
      )}

      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gradient-to-r from-blue-700 to-purple-700 rounded-full blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[300px] md:w-[400px] h-[300px] bg-gradient-to-bl from-green-500 to-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse" />

      {/* Components */}
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default Landingpage;
