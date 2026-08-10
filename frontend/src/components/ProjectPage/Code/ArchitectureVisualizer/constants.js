export const METHOD_STYLES = {
  GET:    "bg-sky-500/20 text-sky-300 border-sky-400/40",
  POST:   "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
  PUT:    "bg-amber-500/20 text-amber-300 border-amber-400/40",
  PATCH:  "bg-orange-500/20 text-orange-300 border-orange-400/40",
  DELETE: "bg-red-500/20 text-red-300 border-red-400/40",
  WS:     "bg-purple-500/20 text-purple-300 border-purple-400/40",
};

export const FILE_TYPE_COLORS = {
  jsx: { bg: "bg-cyan-500",    text: "text-cyan-300",    light: "bg-cyan-500/20 border-cyan-400/30 text-cyan-300",    label: "JSX/TSX" },
  tsx: { bg: "bg-cyan-500",    text: "text-cyan-300",    light: "bg-cyan-500/20 border-cyan-400/30 text-cyan-300",    label: "JSX/TSX" },
  js:  { bg: "bg-yellow-400",  text: "text-yellow-300",  light: "bg-yellow-500/20 border-yellow-400/30 text-yellow-300", label: "JS/TS" },
  ts:  { bg: "bg-yellow-400",  text: "text-yellow-300",  light: "bg-yellow-500/20 border-yellow-400/30 text-yellow-300", label: "JS/TS" },
  css: { bg: "bg-pink-500",    text: "text-pink-300",    light: "bg-pink-500/20 border-pink-400/30 text-pink-300",    label: "CSS" },
  json:{ bg: "bg-emerald-500", text: "text-emerald-300", light: "bg-emerald-500/20 border-emerald-400/30 text-emerald-300", label: "JSON" },
  html:{ bg: "bg-orange-500",  text: "text-orange-300",  light: "bg-orange-500/20 border-orange-400/30 text-orange-300", label: "HTML" },
  md:  { bg: "bg-slate-400",   text: "text-slate-300",   light: "bg-slate-600/40 border-slate-500/30 text-slate-300",  label: "MD" },
  env: { bg: "bg-red-400",     text: "text-red-300",     light: "bg-red-500/20 border-red-400/30 text-red-300",        label: "ENV" },
};

export const getExt = (f) => {
  if (!f) return "other";
  if (f.endsWith(".env") || f.includes(".env.")) return "env";
  return f.split(".").pop()?.toLowerCase() || "other";
};

export const getExtColor = (f) => {
  const ext = getExt(f);
  return FILE_TYPE_COLORS[ext]?.text || "text-slate-300";
};

export const NODE_STYLES = {
  blue:    { ring: "border-blue-400 ring-2 ring-blue-500/30 bg-blue-950/40",    idle: "border-blue-500/30 hover:border-blue-400/60 bg-slate-950/95",    icon: "bg-blue-500/15 border-blue-400/40 text-blue-400",    badge: "bg-blue-500/20 border-blue-400/30 text-blue-300",    glow: "bg-blue-500",    label: "text-blue-300" },
  purple:  { ring: "border-purple-400 ring-2 ring-purple-500/30 bg-purple-950/40", idle: "border-purple-500/30 hover:border-purple-400/60 bg-slate-950/95", icon: "bg-purple-500/15 border-purple-400/40 text-purple-400", badge: "bg-purple-500/20 border-purple-400/30 text-purple-300", glow: "bg-purple-500", label: "text-purple-300" },
  cyan:    { ring: "border-cyan-400 ring-2 ring-cyan-500/30 bg-cyan-950/40",    idle: "border-cyan-500/30 hover:border-cyan-400/60 bg-slate-950/95",    icon: "bg-cyan-500/15 border-cyan-400/40 text-cyan-400",    badge: "bg-cyan-500/20 border-cyan-400/30 text-cyan-300",    glow: "bg-cyan-500",    label: "text-cyan-300" },
  emerald: { ring: "border-emerald-400 ring-2 ring-emerald-500/30 bg-emerald-950/40", idle: "border-emerald-500/30 hover:border-emerald-400/60 bg-slate-950/95", icon: "bg-emerald-500/15 border-emerald-400/40 text-emerald-400", badge: "bg-emerald-500/20 border-emerald-400/30 text-emerald-300", glow: "bg-emerald-500", label: "text-emerald-300" },
};

export const TAB_ACTIVE = {
  purple:  "bg-purple-500/20 text-purple-200 border border-purple-400/40",
  cyan:    "bg-cyan-500/20 text-cyan-200 border border-cyan-400/40",
  emerald: "bg-emerald-500/20 text-emerald-200 border border-emerald-400/40",
  amber:   "bg-amber-500/20 text-amber-200 border border-amber-400/40",
  pink:    "bg-pink-500/20 text-pink-200 border border-pink-400/40",
  blue:    "bg-blue-500/20 text-blue-200 border border-blue-400/40",
};

export const KNOWN_TECH = [
  { key: "react",       label: "React",       color: "bg-cyan-500/20 border-cyan-400/30 text-cyan-300"       },
  { key: "express",     label: "Express",     color: "bg-yellow-500/20 border-yellow-400/30 text-yellow-300"  },
  { key: "socket.io",   label: "Socket.io",   color: "bg-purple-500/20 border-purple-400/30 text-purple-300"  },
  { key: "mongoose",    label: "Mongoose",    color: "bg-emerald-500/20 border-emerald-400/30 text-emerald-300" },
  { key: "mongodb",     label: "MongoDB",     color: "bg-emerald-500/20 border-emerald-400/30 text-emerald-300" },
  { key: "vite",        label: "Vite",        color: "bg-orange-500/20 border-orange-400/30 text-orange-300"  },
  { key: "tailwindcss", label: "Tailwind",    color: "bg-cyan-500/20 border-cyan-400/30 text-cyan-300"       },
  { key: "typescript",  label: "TypeScript",  color: "bg-blue-500/20 border-blue-400/30 text-blue-300"       },
  { key: "jsonwebtoken",label: "JWT",         color: "bg-pink-500/20 border-pink-400/30 text-pink-300"       },
  { key: "redis",       label: "Redis",       color: "bg-red-500/20 border-red-400/30 text-red-300"          },
  { key: "next",        label: "Next.js",     color: "bg-slate-700 border-slate-600 text-slate-200"          },
  { key: "prisma",      label: "Prisma",      color: "bg-blue-500/20 border-blue-400/30 text-blue-300"       },
  { key: "axios",       label: "Axios",       color: "bg-blue-500/20 border-blue-400/30 text-blue-300"       },
  { key: "cors",        label: "CORS",        color: "bg-yellow-500/20 border-yellow-400/30 text-yellow-300"  },
  { key: "dotenv",      label: "dotenv",      color: "bg-emerald-500/20 border-emerald-400/30 text-emerald-300" },
  { key: "zod",         label: "Zod",         color: "bg-purple-500/20 border-purple-400/30 text-purple-300"  },
  { key: "bcrypt",      label: "bcrypt",      color: "bg-red-500/20 border-red-400/30 text-red-300"          },
  { key: "multer",      label: "Multer",      color: "bg-amber-500/20 border-amber-400/30 text-amber-300"    },
];
