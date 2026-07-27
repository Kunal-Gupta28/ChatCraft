import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play, Bot, CheckCircle2 } from "lucide-react";
import { containerVariants, itemVariants } from "../../data/AnimationData";
import ActionButton from "./ActionButton";

const Hero = () => {
  return (
    <main className="w-full relative py-20 md:py-28 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-center overflow-hidden">
      {/* Background Ambient Flares */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

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
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs sm:text-sm font-semibold mb-6 shadow-lg shadow-blue-500/5 backdrop-blur-xl"
          >
            <Sparkles size={15} className="animate-pulse" />
            <span>Next-Gen Cloud IDE Powered by Gemini AI & WebContainers</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl leading-[1.15]"
          >
            Craft, Collaborate & Run Code.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              Instantly in the Browser.
            </span>
          </motion.h1>

          {/* Description Paragraph */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Real-time multi-user pair programming, AI assistant assistance, and full-stack Node.js & React execution inside your browser. No local setup needed.
          </motion.p>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <ActionButton
              to="/auth/login"
              variant="primary"
              className="text-base px-8 py-3.5 rounded-xl shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 transition-all cursor-pointer font-semibold flex items-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4" />
            </ActionButton>

            <a
              href="https://github.com/Kunal-Gupta28/ChatCraft"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 text-base font-medium transition-all backdrop-blur-xl cursor-pointer"
            >
              View Documentation
            </a>
          </motion.div>

          {/* Key Feature Pills */}
          <motion.div variants={itemVariants} className="mt-10 flex flex-wrap justify-center items-center gap-6 text-xs text-gray-400 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-green-400" />
              Real-Time Socket Sync
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-blue-400" />
              Native WebContainers Engine
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-purple-400" />
              Gemini AI Code Generation
            </span>
          </motion.div>

          {/* Simulated IDE Preview Card */}
          <motion.div
            variants={itemVariants}
            className="mt-14 w-full max-w-5xl rounded-2xl bg-gray-900/90 border border-gray-800/90 shadow-2xl shadow-black/80 overflow-hidden text-left backdrop-blur-2xl"
          >
            {/* IDE Window Topbar */}
            <div className="px-4 py-3 bg-gray-950/80 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs font-mono text-gray-400">ChatCraft Workspace — App.jsx</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/30 font-mono flex items-center gap-1">
                  <Play size={10} fill="currentColor" /> WebContainer Active
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30 font-mono flex items-center gap-1">
                  <Bot size={11} /> @ai Ready
                </span>
              </div>
            </div>

            {/* Code Body */}
            <div className="p-5 font-mono text-xs sm:text-sm text-gray-300 leading-relaxed overflow-x-auto bg-gray-950/40">
              <p><span className="text-purple-400">import</span> React <span className="text-purple-400">from</span> <span className="text-green-300">'react'</span>;</p>
              <p><span className="text-purple-400">import</span> &#123; <span className="text-yellow-300">useChat</span> &#125; <span className="text-purple-400">from</span> <span className="text-green-300">'./contexts/chat.context'</span>;</p>
              <p className="mt-2"><span className="text-blue-400">export default function</span> <span className="text-yellow-300">App</span>() &#123;</p>
              <p className="pl-4 text-gray-400">// Prompt AI directly in workspace chat using @ai</p>
              <p className="pl-4"><span className="text-blue-400">const</span> &#123; <span className="text-indigo-300">handleSend</span> &#125; = <span className="text-yellow-300">useChat</span>();</p>
              <p className="pl-4"><span className="text-purple-400">return</span> (</p>
              <p className="pl-8">&lt;<span className="text-blue-400">div</span> <span className="text-cyan-300">className</span>=<span className="text-green-300">"cloud-ide-workspace"</span>&gt;</p>
              <p className="pl-12">&lt;<span className="text-yellow-300">RealTimeCollaborator</span> <span className="text-cyan-300">room</span>=<span className="text-green-300">"dev-team"</span> /&gt;</p>
              <p className="pl-8">&lt;/<span className="text-blue-400">div</span>&gt;</p>
              <p className="pl-4">);</p>
              <p>&#125;</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
};

export default Hero;
