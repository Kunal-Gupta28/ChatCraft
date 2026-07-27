import { memo } from "react";
import Header from "../components/LandingPage/Header";
import Architecture from "../components/LandingPage/Architecture";
import CTA from "../components/LandingPage/CTA";
import Footer from "../components/LandingPage/footer/Footer";
import BackgroundBlobs from "../components/BackgroundBlobs";
import { Cpu, Server, Database, Zap, Lock, ShieldCheck } from "lucide-react";

const SYSTEM_METRICS = [
  { label: "WASM Mount Speed", val: "< 400 ms", sub: "Local WebContainer initialization" },
  { label: "Socket Sync Latency", val: "< 15 ms", sub: "Bi-directional WebSocket messaging" },
  { label: "AI Response Pipeline", val: "Gemini 1.5 Pro", sub: "Context-aware code AST generation" },
  { label: "State Re-render Overhead", val: "0 ms", sub: "Normalized Redux Toolkit selectors" },
];

const ArchitecturePage = () => {
  return (
    <div className="min-h-screen bg-[#080b11] text-white relative select-none">
      <BackgroundBlobs />
      <Header />

      <main className="pt-8 pb-16">
        {/* Page Title */}
        <div className="max-w-6xl mx-auto px-6 text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-4">
            <Cpu size={14} />
            <span>Technical Deep Dive</span>
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-4">
            ChatCraft <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Architecture</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            A high-performance system designed for sub-millisecond local speed, multi-user concurrency, and AI AST generation.
          </p>
        </div>

        {/* System Metrics Banner */}
        <div className="max-w-5xl mx-auto px-6 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SYSTEM_METRICS.map((m, idx) => (
              <div key={idx} className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl text-center backdrop-blur-xl">
                <p className="text-2xl font-black text-indigo-400 mb-1">{m.val}</p>
                <p className="text-xs font-bold text-white mb-0.5">{m.label}</p>
                <p className="text-[10px] text-slate-500">{m.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture Diagram Cards */}
        <Architecture />

        <CTA />
      </main>

      <Footer />
    </div>
  );
};

export default memo(ArchitecturePage);
