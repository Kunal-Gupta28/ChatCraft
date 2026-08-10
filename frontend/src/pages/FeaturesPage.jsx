import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/LandingPage/Header";
import Features from "../components/LandingPage/Features";
import CTA from "../components/LandingPage/CTA";
import Footer from "../components/LandingPage/footer/Footer";
import BackgroundBlobs from "../components/BackgroundBlobs";
import {
  Sparkles, CheckCircle, Cpu, Network, Bot, Layers, FileCode,
  ShieldCheck, Terminal, Play, ArrowRight, Code2, Database, Zap
} from "lucide-react";

const FEATURE_SIMULATOR_TABS = [
  {
    id: "sockets",
    title: "Real-Time Socket Sync",
    badge: "< 15ms Broadcast",
    icon: Network,
    desc: "Sub-15ms WebSocket synchronization powering real-time code editing, line cursor presence, typing indicators, and instant message reactions.",
    code: `// Real-Time Socket Event Synchronization
socket.emit("project-editor-presence", {
  projectId: "proj-9821",
  filePath: "src/App.jsx",
  cursor: { lineNumber: 42, column: 12 }
});

socket.on("project-message-edit", ({ messageId, newText }) => {
  dispatch(updateMessageInState({ messageId, newText }));
});`
  },
  {
    id: "ai",
    title: "Gemini 2.5 AI Co-Pilot",
    badge: "JSON AST Gen",
    icon: Bot,
    desc: "Prompt Gemini AI using @ai to analyze code, construct multi-file AST trees, and present visual diff comparisons with one-click apply.",
    code: `// Gemini 2.5 AST Payload Generation
const prompt = "@ai refactor gameController.js to use backend API";
const astPayload = await aiService.generateCodeAST(prompt, currentFileTree);

// Triggers CodeDiffReview modal with visual line-by-line diffs
dispatch(setActiveSuggestion({ suggestion: astPayload }));`
  },
  {
    id: "runtime",
    title: "Dual-Engine Runtime",
    badge: "WASM + Safari Fallback",
    icon: Cpu,
    desc: "Executes Node.js inside WebContainers WASM for Chromium/Firefox, paired with dynamic Babel transpilation & CJS polyfill for Safari & iOS.",
    code: `// Dual-Engine Preview Selector
if (isWebContainerSupported()) {
  const container = await getWebContainer();
  await container.mount(toWebContainerTree(fileTree));
} else {
  // Safari WebKit Live Fallback Engine
  const blobUrl = buildFallbackPreviewUrl(flattenFileTree(fileTree));
  setIframeUrl(blobUrl);
}`
  },
  {
    id: "modular",
    title: "Micro-Modular Architecture",
    badge: "< 300 Lines / File",
    icon: Layers,
    desc: "Every monolithic component is decomposed into single-responsibility sub-modules under dedicated directories for 0 unneeded re-renders.",
    code: `// Micro-Modular Directory Structure
CodeEditor/
├── FileTree.jsx           # Explorer sidebar
├── TabsBar.jsx            # Tab switcher & presence
├── EditorPane.jsx         # Monaco editor
├── PreviewPane.jsx        # Dual-engine frame
└── previewUtils.js        # Fallback transpiler`
  }
];

const COMPARISON_SPECS = [
  { feature: "In-Browser Node.js Execution", chatcraft: "Instant (WebContainer WASM)", traditional: "Slow (Server Container / VM)" },
  { feature: "AI Assistant Integration", chatcraft: "Native Gemini (@ai in chat)", traditional: "External extension plugin" },
  { feature: "Real-Time Pair Programming", chatcraft: "Built-in Socket.io sync", traditional: "Requires complex setup" },
  { feature: "State Re-render Performance", chatcraft: "Redux Toolkit Normalized", traditional: "Unmemoized Context cascades" },
  { feature: "Safari & Mobile Compatibility", chatcraft: "Babel + CJS Polyfill Fallback", traditional: "Unsupported (SharedArrayBuffer error)" },
  { feature: "Zero Server Setup Required", chatcraft: "100% Client-Side Executable", traditional: "Docker / Terminal setup needed" },
];

const FeaturesPage = () => {
  const [activeTab, setActiveTab] = useState(FEATURE_SIMULATOR_TABS[0]);

  return (
    <div className="min-h-screen bg-[#06080e] text-slate-100 relative select-none font-sans">
      <BackgroundBlobs />
      <Header />
      
      <main className="pt-12 pb-20">
        {/* Page Hero Header */}
        <div className="max-w-4xl mx-auto px-6 text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-indigo-300 text-xs font-mono mb-4 shadow-md">
            <Sparkles size={13} className="text-indigo-400 animate-pulse" />
            <span>Deep Feature Specification</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Everything You Need to Build & Collaborate Fast
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Explore the deep technical features engineered into ChatCraft for sub-millisecond cloud IDE execution, real-time pair programming, and AI AST code generation.
          </p>
        </div>

        {/* Interactive Feature Simulator Component */}
        <div className="max-w-5xl mx-auto px-6 mb-16">
          <div className="bg-[#090c15] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl hover:border-slate-700 transition-colors">
            {/* Header Tabs */}
            <div className="bg-[#0c101d] border-b border-slate-800 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {FEATURE_SIMULATOR_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab.id === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        isActive
                          ? "bg-slate-800 text-white font-bold border border-slate-700 shadow-sm"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                      }`}
                    >
                      <Icon size={14} className={isActive ? "text-indigo-400" : "text-slate-500"} />
                      <span>{tab.title}</span>
                    </button>
                  );
                })}
              </div>

              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                {activeTab.badge}
              </span>
            </div>

            {/* Content Body */}
            <div className="p-6 grid md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5 space-y-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <activeTab.icon size={20} />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">{activeTab.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-sans">{activeTab.desc}</p>
                <div className="pt-2">
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                    <ShieldCheck size={14} /> Production Ready & Validated
                  </span>
                </div>
              </div>

              <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 overflow-x-auto">
                <pre>
                  <code>{activeTab.code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid Component */}
        <Features showHeader={false} />

        {/* Feature Comparison Spec Table */}
        <div className="max-w-5xl mx-auto px-6 mt-16 mb-20">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Why Developers Choose ChatCraft
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Comparing ChatCraft WebContainers with traditional cloud IDE setups.
            </p>
          </div>

          <div className="bg-[#090c15] border border-slate-800 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-950 text-slate-300 border-b border-slate-800 font-mono">
                  <th className="p-4 font-bold">Feature Specification</th>
                  <th className="p-4 font-bold text-white">ChatCraft IDE</th>
                  <th className="p-4 font-bold text-slate-500">Traditional Cloud IDEs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {COMPARISON_SPECS.map((spec, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/60 transition">
                    <td className="p-4 text-slate-200 font-sans font-medium">{spec.feature}</td>
                    <td className="p-4 text-slate-200 font-semibold flex items-center gap-1.5">
                      <CheckCircle size={15} className="text-emerald-400 shrink-0" />
                      <span>{spec.chatcraft}</span>
                    </td>
                    <td className="p-4 text-slate-500">{spec.traditional}</td>
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
