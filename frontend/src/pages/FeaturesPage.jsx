import { memo } from "react";
import Header from "../components/LandingPage/Header";
import Features from "../components/LandingPage/Features";
import CTA from "../components/LandingPage/CTA";
import Footer from "../components/LandingPage/footer/Footer";
import BackgroundBlobs from "../components/BackgroundBlobs";
import { CheckCircle, Zap, Shield, Sparkles, Code, Cpu } from "lucide-react";

const COMPARISON_SPECS = [
  { feature: "In-Browser Node.js Execution", chatcraft: "Instant (WebContainer WASM)", traditional: "Slow (Server Container / VM)" },
  { feature: "AI Assistant Integration", chatcraft: "Native Gemini (@ai in chat)", traditional: "External extension plugin" },
  { feature: "Real-Time Pair Programming", chatcraft: "Built-in Socket.io sync", traditional: "Requires complex setup" },
  { feature: "State Re-render Performance", chatcraft: "Redux Toolkit Normalized", traditional: "Unmemoized Context cascades" },
  { feature: "Zero Server Setup", chatcraft: "100% Browser Executable", traditional: "Docker/Terminal config needed" },
];

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-[#080b11] text-white relative select-none">
      <BackgroundBlobs />
      <Header />
      
      <main className="pt-8 pb-16">
        {/* Page Title Header */}
        <div className="max-w-6xl mx-auto px-6 text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-4">
            <Sparkles size={14} />
            <span>Deep Dive Features</span>
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-4">
            Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Build Fast</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Explore the powerful tools built directly into ChatCraft for full-stack cloud development.
          </p>
        </div>

        {/* Feature Grid Component */}
        <Features />

        {/* Feature Comparison Spec Table */}
        <div className="max-w-5xl mx-auto px-6 mt-16 mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Why Developers Choose ChatCraft
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Comparing ChatCraft WebContainers with traditional cloud IDE setups.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-950/80 text-slate-300 border-b border-slate-800">
                  <th className="p-4 font-bold">Feature</th>
                  <th className="p-4 font-bold text-blue-400">ChatCraft IDE</th>
                  <th className="p-4 font-bold text-slate-500">Traditional Cloud IDEs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {COMPARISON_SPECS.map((spec, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 text-slate-200 font-medium">{spec.feature}</td>
                    <td className="p-4 text-blue-300 font-semibold flex items-center gap-1.5">
                      <CheckCircle size={15} className="text-blue-400 shrink-0" />
                      <span>{spec.chatcraft}</span>
                    </td>
                    <td className="p-4 text-slate-400">{spec.traditional}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <CTA />
      </main>

      <Footer />
    </div>
  );
};

export default memo(FeaturesPage);
