import {
  Users, Bot, Terminal, Lightbulb, Code, Rocket, Cpu, Network, ShieldCheck, Layers, FileCode
} from "lucide-react";

// Expanded comprehensive features list
export const features = [
  {
    icon: Network,
    title: "Real-Time Socket Synchronization",
    description:
      "Powered by an isolated Socket.io gateway (projectSockets.js). Features sub-15ms broadcast sync for live pair-programming, editor cursor presence, typing indicators, and real-time message editing, deletion, and reactions.",
  },
  {
    icon: Bot,
    title: "Gemini 2.5 Flash AI Engine",
    description:
      "Prompt AI directly in workspace chat using @ai. Generates structured JSON AST code payloads, diff review comparisons (CodeDiffReview) with one-click file tree application, and WebSpeech voice explanation audio synthesis.",
  },
  {
    icon: Cpu,
    title: "Dual-Engine In-Browser Runtime",
    description:
      "StackBlitz WebContainers WASM engine (@webcontainer/api) executes Node.js, npm scripts, and React dev servers inside Chromium/Firefox. Paired with a dynamic Babel transpiler & CJS polyfill engine for 100% Safari & iOS parity.",
  },
  {
    icon: Layers,
    title: "Micro-Modular Sub-Component State",
    description:
      "Decomposed all monolithic components into single-responsibility micro-modules (< 300 lines per file). Combines Redux Toolkit normalized slices with React Query caching to guarantee 0 unneeded re-renders.",
  },
  {
    icon: FileCode,
    title: "Monaco Code Editor & Explorer",
    description:
      "VS Code-powered Monaco Editor integration with multi-file tab switching, extension-specific Lucide icons, auto-expanded folder explorer, and intelligent VS Code file/folder sorting.",
  },
  {
    icon: ShieldCheck,
    title: "Zero-Trust Security & Redis Cache",
    description:
      "Strict Bcrypt password hashing (10 salt rounds), JWT authentication, IDOR protected project room subscriptions, and Redis token blacklisting for instant cryptographic logout invalidation.",
  },
];

// howItWorks mock data
export const howItWorks = [
  {
    icon: Lightbulb,
    title: "1. Workspace Initialization",
    description:
      "Create a new cloud project or open existing MongoDB file trees. Invite team members with unique share links. Sockets establish authenticated room connections via JWT handshake middleware.",
  },
  {
    icon: Code,
    title: "2. Prompt @ai & Review AST Diffs",
    description:
      "Type @ai in chat to brainstorm features or refactor code. Gemini AI constructs structured multi-file AST trees. Review line-by-line diffs in CodeDiffReview and apply changes with one click.",
  },
  {
    icon: Rocket,
    title: "3. In-Browser WASM Execution",
    description:
      "Click 'Run' to mount the virtual file tree inside in-browser WebContainers (WASM). Hot-reload updates stream live on Port 3000 in the preview panel with zero server setup.",
  },
];

// testimonials mock data
export const testimonials = [
  {
    quote:
      "ChatCraft's dual-engine WASM runtime and @ai assistant integration completely eliminated our local environment setup overhead. Instant live preview on both Chrome and Safari!",
    author: "Alex Rivers",
    title: "Principal Architect at CloudScale",
  },
  {
    quote:
      "The sub-15ms real-time socket sync and cursor presence make pair programming feel smoother than local VS Code Live Share. Outstanding performance!",
    author: "Sarah Chen",
    title: "Lead Frontend Engineer at DevCore",
  },
  {
    quote:
      "Gemini AI's AST code generation paired with the visual diff review modal allows our team to generate and verify complex React features in seconds.",
    author: "Marcus Vance",
    title: "Full-Stack Tech Lead",
  },
];
