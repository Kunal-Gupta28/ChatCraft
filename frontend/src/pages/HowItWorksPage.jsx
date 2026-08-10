import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/LandingPage/Header";
import HowItWorks from "../components/LandingPage/HowItWorks";
import CTA from "../components/LandingPage/CTA";
import Footer from "../components/LandingPage/footer/Footer";
import BackgroundBlobs from "../components/BackgroundBlobs";
import { Play, Bot, Users, Workflow, ArrowRight, Terminal, CheckCircle2, ShieldCheck, Database, Code2 } from "lucide-react";

const STAGE_SIMULATOR = [
  {
    stage: "01",
    title: "Stage 1: Workspace & Socket Handshake",
    badge: "JWT Handshake",
    icon: Users,
    desc: "Collaborator logs in, loads project MongoDB file tree, and connects to Socket.io. Backend projectSockets.js verifies JWT signature and executes socket.join(projectId).",
    code: `// Stage 1: Handshake JWT Verification
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  const decoded = jwt.verify(token, JWT_SECRET);
  socket.user = decoded;
  next();
});`
  },
  {
    stage: "02",
    title: "Stage 2: Prompt @ai & Review AST Diffs",
    badge: "Gemini AST Gen",
    icon: Bot,
    desc: "User types '@ai fix gameController winner logic'. Backend ai.service.js sends file tree context to Gemini 2.5 API. Client renders line-by-line diffs in CodeDiffReview modal.",
    code: `// Stage 2: CodeDiffReview Line Comparison
<CodeDiffReview
  suggestion={activeSuggestion}
  fileTree={fileTree}
  onApply={() => emitSocketEvent("project-files-apply", payload)}
/>`
  },
  {
    stage: "03",
    title: "Stage 3: In-Browser WASM Execution",
    badge: "WebContainer Mount",
    icon: Play,
    desc: "Clicking 'Run' mounts the virtual file tree inside StackBlitz WebContainers WASM. Packages install automatically and React dev server boots on Port 3000.",
    code: `// Stage 3: POSIX Virtual Container Mount
const container = await getWebContainer();
await container.mount(toWebContainerTree(fileTree));
const process = await container.spawn("npm", ["run", "dev"]);`
  },
  {
    stage: "04",
    title: "Stage 4: Real-time Pair Programming",
    badge: "Sub-15ms Sync",
    icon: Workflow,
    desc: "Collaborators edit code simultaneously. Line cursor presence updates live in TabsBar and EditorPane while WebSockets sync edits across all connected clients.",
    code: `// Stage 4: Live Editor Presence Listener
socket.on("project-editor-presence-receive", ({ userId, filePath, cursor }) => {
  dispatch(updateCollaboratorPresence({ userId, filePath, cursor }));
});`
  }
];

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
  const [activeStage, setActiveStage] = useState(STAGE_SIMULATOR[0]);

  return (
    <div className="min-h-screen bg-[#06080e] text-slate-100 relative select-none font-sans">
      <BackgroundBlobs />
      <Header />

      <main className="pt-12 pb-20">
        {/* Page Hero Header */}
        <div className="max-w-4xl mx-auto px-6 text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-indigo-300 text-xs font-mono mb-4 shadow-md">
            <Workflow size={13} className="text-indigo-400 animate-pulse" />
            <span>Development Lifecycle Guide</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            How ChatCraft Works Step by Step
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            A frictionless development process engineered to take you from initial idea to running, collaborative Node.js code in seconds.
          </p>
        </div>

        {/* Interactive Lifecycle Stage Simulator Component */}
        <div className="max-w-5xl mx-auto px-6 mb-16">
          <div className="bg-[#090c15] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl hover:border-slate-700 transition-colors">
            {/* Header Tabs */}
            <div className="bg-[#0c101d] border-b border-slate-800 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {STAGE_SIMULATOR.map((stage) => {
                  const Icon = stage.icon;
                  const isActive = activeStage.stage === stage.stage;
                  return (
                    <button
                      key={stage.stage}
                      type="button"
                      onClick={() => setActiveStage(stage)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        isActive
                          ? "bg-slate-800 text-white font-bold border border-slate-700 shadow-sm"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                      }`}
                    >
                      <Icon size={14} className={isActive ? "text-indigo-400" : "text-slate-500"} />
                      <span>{stage.title.split(":")[0]}</span>
                    </button>
                  );
                })}
              </div>

              <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                {activeStage.badge}
              </span>
            </div>

            {/* Stage Details Body */}
            <div className="p-6 grid md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5 space-y-3">
                <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-800/80 border border-slate-700 px-2 py-0.5 rounded">
                  {activeStage.title.split(":")[0]}
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight">{activeStage.title.split(":")[1]}</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-sans">{activeStage.desc}</p>
                <div className="pt-2">
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                    <ShieldCheck size={14} /> Stage Verified & Operative
                  </span>
                </div>
              </div>

              <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 overflow-x-auto">
                <pre>
                  <code>{activeStage.code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Step Cards */}
        <HowItWorks showHeader={false} />

        {/* Detailed Workflow Process Cards */}
        <div className="max-w-5xl mx-auto px-6 mt-12 mb-20">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Detailed Three-Stage Development Lifecycle
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              From workspace initialization to real-time execution and team pair-programming.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {DETAILED_STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="bg-[#090c15] border border-slate-800 p-6 rounded-xl backdrop-blur-xl hover:border-slate-700 transition-colors">
                  <span className="text-[11px] font-mono font-semibold text-slate-400 bg-slate-800/80 border border-slate-700 px-2 py-0.5 rounded">
                    Step {s.step}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-300 my-4">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 tracking-tight">{s.title}</h3>
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
