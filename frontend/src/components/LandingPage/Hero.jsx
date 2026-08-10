import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2, Play, Terminal, Code2, Bot, Network, ShieldCheck } from "lucide-react";
import { containerVariants, itemVariants } from "../../data/AnimationData";
import ActionButton from "./ActionButton";

const DEMO_TABS = [
  {
    id: "app",
    filename: "App.jsx",
    icon: Code2,
    badge: "React + WASM",
    code: `import React from 'react';
import { useChat } from './contexts/chat.context';
import { RealTimeCanvas } from './components/Canvas';

export default function CloudIDE() {
  // Prompt Gemini AI in workspace chat using @ai
  const { messages, handleSend } = useChat();

  return (
    <div className="workspace-grid h-screen bg-[#06080e]">
      <RealTimeCanvas room="dev-team-alpha" />
      <AICodeAssistant trigger="@ai" autoApply={true} />
    </div>
  );
}`
  },
  {
    id: "sockets",
    filename: "projectSockets.js",
    icon: Network,
    badge: "Socket.io < 15ms",
    code: `// Encapsulated Socket.io Realtime Gateway
const { verifyJwtHandshake } = require('../middlewares/auth.middleware');

module.exports = (io) => {
  io.use(verifyJwtHandshake); // 256-bit Token Guard

  io.on('connection', (socket) => {
    socket.on('project-message', async (data) => {
      io.to(data.projectId).emit('project-message-receive', data);
    });
  });
};`
  },
  {
    id: "ai",
    filename: "ai.service.js",
    icon: Bot,
    badge: "Gemini 2.5 AST",
    code: `// Context-Aware Gemini AST Generator
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function generateCodeAST({ prompt, fileTree }) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(constructASTPrompt(prompt, fileTree));
  return JSON.parse(result.response.text()); // Returns structured FileTree payload
}`
  }
];

const Hero = () => {
  const [activeTab, setActiveTab] = useState(DEMO_TABS[0]);
  const [copied, setCopied] = useState(false);

  return (
    <main className="w-full relative py-16 md:py-24 bg-[#06080e] text-center overflow-hidden select-none font-sans">
      {/* Background Ambient Glow Flares */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-600/15 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[250px] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[92vw] 2xl:max-w-[88vw] mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col items-center"
        >
          {/* AI Badge Pill */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono mb-6 backdrop-blur-xl shadow-lg shadow-indigo-500/10"
          >
            <Sparkles size={14} className="animate-pulse text-indigo-400" />
            <span>Next-Gen Cloud IDE Powered by Gemini 2.5 AI & WebContainers</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl leading-[1.12]"
          >
            Craft, Collaborate & Run Code.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-purple-300">
              Instantly in the Browser.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="mt-5 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Real-time multi-user pair programming, AI assistant assistance, and full-stack Node.js & React execution inside your browser. No local setup needed.
          </motion.p>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <ActionButton
              to="/auth/login"
              variant="primary"
              className="text-sm px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xl shadow-indigo-600/30 border border-indigo-400/30"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4" />
            </ActionButton>

            <a
              href="https://github.com/Kunal-Gupta28/ChatCraft"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-6 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 font-semibold hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              View Documentation & GitHub
            </a>
          </motion.div>

          {/* Trust Metrics Pill Bar */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400"
          >
            <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-3 py-1 rounded-lg">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>Real-Time Socket Sync (&lt; 15ms)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-3 py-1 rounded-lg">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>Native WASM Engine (&lt; 400ms)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-3 py-1 rounded-lg">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>Gemini 2.5 AST Code Gen</span>
            </div>
          </motion.div>

          {/* Interactive Interactive Code Playground Mockup */}
          <motion.div
            variants={itemVariants}
            className="mt-12 w-full max-w-4xl rounded-2xl bg-[#090c15] border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl text-left hover:border-slate-700 transition-colors"
          >
            {/* IDE Window Header Bar */}
            <div className="bg-[#0c101d] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
              {/* Window Dots & Interactive File Tabs */}
              <div className="flex items-center gap-3 overflow-x-auto">
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {DEMO_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab.id === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                          isActive
                            ? "bg-slate-800 text-white font-bold border border-slate-700 shadow-sm"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                        }`}
                      >
                        <Icon size={13} className={isActive ? "text-indigo-400" : "text-slate-500"} />
                        <span>{tab.filename}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex items-center gap-2 text-[11px] font-mono shrink-0">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <Play size={10} className="fill-emerald-400" />
                  <span>WebContainer Active</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  🤖 @ai Ready
                </span>
              </div>
            </div>

            {/* Code Content Editor Viewport */}
            <div className="p-6 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.pre
                  key={activeTab.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  <code>{activeTab.code}</code>
                </motion.pre>
              </AnimatePresence>
            </div>

            {/* Simulated Live Terminal Bar */}
            <div className="bg-slate-950 border-t border-slate-800/80 px-4 py-2.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal size={13} className="text-emerald-400" />
                <span className="text-slate-300">$ npm run dev</span>
                <span className="text-slate-500">➜ Local: http://localhost:3000/</span>
              </div>
              <span className="text-emerald-400 font-bold hidden sm:inline">● Process 0 Error (WASM Mounted)</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
};

export default memo(Hero);
