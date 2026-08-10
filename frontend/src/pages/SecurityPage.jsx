import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/LandingPage/Header";
import CTA from "../components/LandingPage/CTA";
import Footer from "../components/LandingPage/footer/Footer";
import BackgroundBlobs from "../components/BackgroundBlobs";
import {
  ShieldCheck, Lock, Cpu, EyeOff, Server, FileCode, Key, CheckCircle2, Zap, AlertTriangle
} from "lucide-react";

const SECURITY_SHIELD_TABS = [
  {
    id: "wasm",
    title: "WASM Sandbox Isolation",
    badge: "RCE Mitigation",
    icon: Cpu,
    desc: "All untrusted user code and terminal commands execute inside an in-browser WebContainer WebAssembly (WASM) sandbox. Untrusted code never touches the backend server node process.",
    code: `// WebAssembly Client-Side Execution Boundary
const container = await getWebContainer();
// Code runs strictly inside client browser memory space
await container.spawn("npm", ["start"]);`
  },
  {
    id: "jwt",
    title: "Bcrypt & Redis Token Guard",
    badge: "256-bit Crypto Auth",
    icon: Key,
    desc: "Passwords hashed with 10 salt rounds of Bcrypt. Stateless 256-bit JWT tokens are validated on every REST endpoint and Socket.io handshake. Logout appends token signatures to Redis blacklist.",
    code: `// Redis Cryptographic Token Revocation
async function logoutUser(req, res) {
  const token = req.headers.authorization.split(" ")[1];
  await redisClient.set(\`blacklist:\${token}\`, "revoked", "EX", 86400);
  res.json({ message: "Logged out successfully" });
}`
  },
  {
    id: "idor",
    title: "IDOR & Socket Room Scoping",
    badge: "Membership Protection",
    icon: Lock,
    desc: "Every database query and Socket.io channel verifies projectId and userId membership in MongoDB. Non-collaborators are blocked at the middleware layer before room access.",
    code: `// Socket Room Access Control Middleware
if (!project.users.includes(socket.user._id)) {
  return next(new Error("Unauthorized room access attempt blocked"));
}
socket.join(projectId);`
  },
  {
    id: "xss",
    title: "XSS & NoSQL Injection Proof",
    badge: "Auto-Escaped VDOM",
    icon: FileCode,
    desc: "React Virtual DOM automatically escapes user-generated chat text and code blocks. Mongoose strict schema definitions and ObjectId casting neutralize operator payload injections.",
    code: `// Mongoose Strict Schema Casting & XSS Escaping
const messageSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  message: { type: String, required: true } // React escapes string on render
});`
  }
];

const SECURITY_METRICS = [
  { val: "WASM Sandbox", label: "Client-Side Isolation", sub: "Zero server code execution risk" },
  { val: "Bcrypt + JWT", label: "Cryptographic Auth", sub: "Stateless 256-bit token verification" },
  { val: "IDOR Protected", label: "Strict Membership Guard", sub: "Scoped DB & Socket room queries" },
  { val: "100% Escaped", label: "XSS & Injection Proof", sub: "React VDOM & Mongoose casting" },
];

const ATTACK_DEFENSES = [
  {
    icon: Cpu,
    attack: "Remote Code Execution (RCE)",
    status: "Protected",
    description:
      "All user code and terminal commands execute inside an in-browser WebContainer WebAssembly (WASM) sandbox. Untrusted code never touches the backend server node process.",
  },
  {
    icon: Lock,
    attack: "Unauthorized Data Access (IDOR)",
    status: "Protected",
    description:
      "Every REST endpoint and Socket.io channel verifies projectId and userId membership in MongoDB. Non-collaborators are blocked at the middleware layer.",
  },
  {
    icon: FileCode,
    attack: "Cross-Site Scripting (XSS)",
    status: "Protected",
    description:
      "All chat messages and code blocks are automatically escaped by React's Virtual DOM. Live preview frames operate under strict origin sandboxing.",
  },
  {
    icon: Server,
    attack: "NoSQL Database Injection",
    status: "Protected",
    description:
      "Mongoose strict schema definitions and ObjectId casting automatically neutralize operator payload injection attacks (e.g. $gt, $ne).",
  },
  {
    icon: Key,
    attack: "API Secret Leakage & Theft",
    status: "Protected",
    description:
      "AI Gemini key and MongoDB connection strings remain securely isolated in server-side environment variables and are never shipped to client bundles.",
  },
  {
    icon: EyeOff,
    attack: "Socket Eavesdropping",
    status: "Protected",
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
  const [activeShield, setActiveShield] = useState(SECURITY_SHIELD_TABS[0]);

  return (
    <div className="min-h-screen bg-[#06080e] text-slate-100 relative select-none font-sans">
      <BackgroundBlobs />
      <Header />

      <main className="pt-12 pb-20">
        {/* Page Hero Header */}
        <div className="max-w-4xl mx-auto px-6 text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-emerald-400 text-xs font-mono mb-4 shadow-md">
            <ShieldCheck size={13} className="text-emerald-400 animate-pulse" />
            <span>Enterprise Security Guard Specification</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Security & Protection Architecture
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Discover how ChatCraft protects your codebase, collaborative chats, and AI workflows against modern web security threats.
          </p>
        </div>

        {/* Security Metrics Banner */}
        <div className="max-w-5xl mx-auto px-6 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SECURITY_METRICS.map((m, idx) => (
              <div
                key={idx}
                className="bg-[#090c15] border border-slate-800 p-5 rounded-xl text-center backdrop-blur-xl hover:border-slate-700 transition-colors"
              >
                <p className="text-lg font-mono font-bold text-white mb-1">{m.val}</p>
                <p className="text-xs font-semibold text-slate-300 mb-0.5">{m.label}</p>
                <p className="text-[10px] text-slate-500 font-mono">{m.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Security Shield Simulator */}
        <div className="max-w-5xl mx-auto px-6 mb-16">
          <div className="bg-[#090c15] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl hover:border-slate-700 transition-colors">
            <div className="bg-[#0c101d] border-b border-slate-800 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {SECURITY_SHIELD_TABS.map((shield) => {
                  const Icon = shield.icon;
                  const isActive = activeShield.id === shield.id;
                  return (
                    <button
                      key={shield.id}
                      type="button"
                      onClick={() => setActiveShield(shield)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        isActive
                          ? "bg-slate-800 text-white font-bold border border-slate-700 shadow-sm"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                      }`}
                    >
                      <Icon size={14} className={isActive ? "text-emerald-400" : "text-slate-500"} />
                      <span>{shield.title}</span>
                    </button>
                  );
                })}
              </div>

              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                {activeShield.badge}
              </span>
            </div>

            <div className="p-6 grid md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5 space-y-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <activeShield.icon size={20} />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">{activeShield.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-sans">{activeShield.desc}</p>
                <div className="pt-2">
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                    <ShieldCheck size={14} /> 100% Cryptographically Guarded
                  </span>
                </div>
              </div>

              <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 overflow-x-auto">
                <pre>
                  <code>{activeShield.code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Defenses Against Cyber Attacks Grid */}
        <div className="max-w-5xl mx-auto px-6 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Defenses Against Cyber Attacks
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Built-in security layers guarding every request, database query, and WebAssembly container.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {ATTACK_DEFENSES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#090c15] border border-slate-800 p-5 rounded-xl backdrop-blur-xl hover:border-slate-700 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-300">
                        <Icon size={16} />
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                        ✓ {item.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1.5 tracking-tight">{item.attack}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">{item.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    <span>Mitigated at Architecture level</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best Practices Section */}
        <div className="max-w-4xl mx-auto px-6 mb-20">
          <div className="bg-[#090c15] border border-slate-800 p-6 sm:p-8 rounded-xl backdrop-blur-xl">
            <h3 className="text-lg font-bold text-white mb-4 tracking-tight">
              Platform Security Checklist
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {BEST_PRACTICES.map((practice, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
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
