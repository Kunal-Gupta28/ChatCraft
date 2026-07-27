import { memo } from "react";
import Header from "../components/LandingPage/Header";
import HowItWorks from "../components/LandingPage/HowItWorks";
import CTA from "../components/LandingPage/CTA";
import Footer from "../components/LandingPage/footer/Footer";
import BackgroundBlobs from "../components/BackgroundBlobs";
import { Play, Bot, Users, ArrowRight } from "lucide-react";

const DETAILED_STEPS = [
  {
    step: "01",
    title: "Create or Select a Workspace",
    icon: Users,
    desc: "Start with an empty template or open existing project files stored securely in MongoDB. Invite team members with unique share links.",
  },
  {
    step: "02",
    title: "Prompt Gemini AI with @ai",
    icon: Bot,
    desc: "Type @ai in the project chat to generate code files, debug errors, or ask questions. AI generated code seamlessly integrates into your FileTree.",
  },
  {
    step: "03",
    title: "Run Node.js & React in WebContainer",
    icon: Play,
    desc: "Click 'Run' to mount the project inside browser WebContainers (WASM). Hot-reload updates live in the instant preview panel.",
  },
];

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-[#080b11] text-white relative select-none">
      <BackgroundBlobs />
      <Header />

      <main className="pt-8 pb-16">
        {/* Page Title */}
        <div className="max-w-6xl mx-auto px-6 text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-4">
            <span>Workflow Guide</span>
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-4">
            How ChatCraft Works <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Step by Step</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            A frictionless development process designed to take you from idea to running code in seconds.
          </p>
        </div>

        {/* How It Works Step Cards */}
        <HowItWorks />

        {/* Detailed Workflow Process Cards */}
        <div className="max-w-5xl mx-auto px-6 mt-12 mb-20">
          <div className="grid md:grid-cols-3 gap-6">
            {DETAILED_STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl relative">
                  <span className="text-xs font-black text-purple-400 bg-purple-500/10 border border-purple-500/30 px-2.5 py-1 rounded-lg">
                    Step {s.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 my-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <CTA />
      </main>

      <Footer />
    </div>
  );
};

export default memo(HowItWorksPage);
