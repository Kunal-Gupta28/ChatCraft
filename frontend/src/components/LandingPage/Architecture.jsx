import { memo } from "react";
import { motion } from "framer-motion";
import { Cpu, Bot, Zap, Database, Network, ShieldCheck } from "lucide-react";
import { containerVariants, itemVariants } from "../../data/AnimationData";

const ARCH_LAYERS = [
  {
    icon: Cpu,
    title: "Browser WebContainers Engine",
    badge: "WASM Runtime",
    color: "text-green-400 border-green-500/30 bg-green-500/10",
    description:
      "Executes Node.js, npm scripts, and React dev servers directly inside your browser using WebAssembly. 0 cloud server cost & instant hot-reloading.",
  },
  {
    icon: Bot,
    title: "Gemini AI Assistant Engine",
    badge: "LLM Code Gen",
    color: "text-purple-400 border-purple-500/30 bg-purple-500/10",
    description:
      "Context-aware AI companion hooked directly into your project AST & chat using @ai. Generates code, inspects errors, and writes tests.",
  },
  {
    icon: Network,
    title: "Socket.io Multi-User Sync",
    badge: "Real-Time Transport",
    color: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    description:
      "Bi-directional WebSocket engine powering real-time pair programming, instant chat messages, and file tree updates across collaborators.",
  },
  {
    icon: Database,
    title: "Redux Toolkit & Redis Cache",
    badge: "State Management",
    color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
    description:
      "Normalized global client state in Redux Toolkit combined with Redis server session caching to guarantee 0 unneeded re-renders.",
  },
];

const Architecture = () => {
  return (
    <section id="architecture" className="py-24 bg-[#080b11] relative overflow-hidden select-none border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Tag */}
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Zap size={13} />
            <span>Under The Hood</span>
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-5xl font-extrabold text-center text-white tracking-tight mb-4">
          System Architecture
        </h2>
        <p className="text-slate-400 text-center text-sm sm:text-base max-w-xl mx-auto mb-16">
          Designed for sub-millisecond local speed, real-time multi-user collaboration, and deep AI integration.
        </p>

        {/* Architecture Grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {ARCH_LAYERS.map((layer) => {
            const Icon = layer.icon;
            return (
              <motion.article
                key={layer.title}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="rounded-2xl bg-slate-900/60 p-7 border border-slate-800/80 hover:border-indigo-500/50 backdrop-blur-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-md">
                      <Icon size={24} />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${layer.color}`}>
                      {layer.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                    {layer.title}
                  </h3>

                  <p className="text-slate-400 text-sm leading-relaxed">
                    {layer.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <ShieldCheck size={14} className="text-indigo-400" />
                  <span>Enterprise Grade Protocol</span>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default memo(Architecture);
