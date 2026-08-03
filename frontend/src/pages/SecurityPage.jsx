import { memo } from "react";
import Header from "../components/LandingPage/Header";
import CTA from "../components/LandingPage/CTA";
import Footer from "../components/LandingPage/footer/Footer";
import BackgroundBlobs from "../components/BackgroundBlobs";
import {
  ShieldCheck,
  Lock,
  Cpu,
  EyeOff,
  Server,
  FileCode,
  Key,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from "lucide-react";

const SECURITY_METRICS = [
  { val: "WASM Sandbox", label: "Client-Side Isolation", sub: "Zero server code execution risk" },
  { val: "Bcrypt + JWT", label: "Cryptographic Auth", sub: "Stateless 256-bit token verification" },
  { val: "IDOR Protected", label: "Strict Membership Guard", sub: "Scoped DB & Socket room queries" },
  { val: "100% Escaped", label: "XSS & Injection Proof", sub: "React VDOM & Mongoose casting" },
];

const ATTACK_DEFENSES = [
  {
    icon: <Cpu className="text-cyan-400" size={24} />,
    attack: "Remote Code Execution (RCE)",
    status: "Protected",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    description:
      "All user code and terminal commands execute inside an in-browser WebContainer WebAssembly (WASM) sandbox. Untrusted code never touches the backend server node process.",
  },
  {
    icon: <Lock className="text-purple-400" size={24} />,
    attack: "Unauthorized Data Access (IDOR)",
    status: "Protected",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    description:
      "Every REST endpoint and Socket.io channel verifies projectId and userId membership in MongoDB. Non-collaborators are blocked at the middleware layer.",
  },
  {
    icon: <FileCode className="text-amber-400" size={24} />,
    attack: "Cross-Site Scripting (XSS)",
    status: "Protected",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    description:
      "All chat messages and code blocks are automatically escaped by React's Virtual DOM. Live preview frames operate under strict origin sandboxing.",
  },
  {
    icon: <Server className="text-indigo-400" size={24} />,
    attack: "NoSQL Database Injection",
    status: "Protected",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
    description:
      "Mongoose strict schema definitions and ObjectId casting automatically neutralize operator payload injection attacks (e.g. $gt, $ne).",
  },
  {
    icon: <Key className="text-emerald-400" size={24} />,
    attack: "API Secret Leakage & Credential Theft",
    status: "Protected",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    description:
      "AI Gemini key and MongoDB connection strings remain securely isolated in server-side environment variables and are never shipped to client bundles.",
  },
  {
    icon: <EyeOff className="text-rose-400" size={24} />,
    attack: "Socket Eavesdropping & Packet Sniffing",
    status: "Protected",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    description:
      "Socket.io handshake middleware validates JWT signatures before allowing clients to join isolated project rooms (socket.join(projectId)).",
  },
];

const BEST_PRACTICES = [
  "Strict password hashing with 10 salt rounds of Bcrypt",
  "Stateless JSON Web Tokens with expiry enforcement",
  "CORS origin restrictions for verified frontend domains",
  "Immutable Redux Toolkit state updates preventing memory leaks",
  "Immer proxy cleansing preventing prototype pollution",
  "Continuous real-time room isolation on socket connections",
];

const SecurityPage = () => {
  return (
    <div className="min-h-screen bg-[#080b11] text-white relative select-none">
      <BackgroundBlobs />
      <Header />

      <main className="pt-8 pb-16">
        {/* Page Title */}
        <div className="max-w-6xl mx-auto px-6 text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
            <ShieldCheck size={14} />
            <span>Enterprise Security Guard</span>
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-4">
            Security & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Protection</span> Architecture
          </h1>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            Discover how ChatCraft protects your codebase, collaborative chats, and AI workflows against modern web security threats.
          </p>
        </div>

        {/* Security Metrics Banner */}
        <div className="max-w-5xl mx-auto px-6 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SECURITY_METRICS.map((m, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl text-center backdrop-blur-xl hover:border-emerald-500/40 transition shadow-lg"
              >
                <p className="text-xl font-black text-emerald-400 mb-1 truncate">{m.val}</p>
                <p className="text-xs font-bold text-white mb-0.5">{m.label}</p>
                <p className="text-[10px] text-slate-500">{m.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Attack Defenses Grid */}
        <div className="max-w-6xl mx-auto px-6 mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              Defenses Against Modern Cyber Attacks
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Built-in security layers guarding every request, database query, and WebAssembly container.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ATTACK_DEFENSES.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0d121f]/90 border border-slate-800/90 hover:border-slate-700 backdrop-blur-2xl transition flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
                      {item.icon}
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-mono border ${item.badgeColor}`}
                    >
                      ✓ {item.status}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-white mb-2">
                    {item.attack}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                  <CheckCircle2 size={13} />
                  <span>Mitigated at Architecture level</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Security Practices */}
        <div className="max-w-4xl mx-auto px-6 mb-16">
          <div className="bg-[#090d16]/95 border border-emerald-500/30 p-8 rounded-3xl backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">
                  Full Stack Security Hardening
                </h3>
                <p className="text-xs text-slate-400">
                  Continuous protection across Frontend, Backend, Database, and WebSockets.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {BEST_PRACTICES.map((practice, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>{practice}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <CTA />
      </main>

      <Footer />
    </div>
  );
};

export default memo(SecurityPage);
