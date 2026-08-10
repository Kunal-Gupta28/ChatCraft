import { memo } from "react";
import FooterColumn from "./FooterColumn";
import { Code2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#06080e] py-12 border-t border-slate-800/80 text-slate-400 text-xs select-none font-sans">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-10">

        {/* Brand Column */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md bg-indigo-600 border border-indigo-400/30 flex items-center justify-center text-white">
              <Code2 size={14} />
            </div>
            <span className="font-extrabold text-white text-base tracking-tight">
              Chat<span className="text-indigo-400">Craft</span>
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
            Next-gen collaborative, AI-powered cloud development workspace for modern dev teams.
          </p>
        </div>

        {/* Navigation Link Columns */}
        <FooterColumn title="Product" links={["Features", "How it Works", "Architecture", "Security"]} />
        <FooterColumn title="Technology" links={["WebContainers WASM", "Gemini 2.5 Flash AI", "Socket.io Transport", "Redux Toolkit State"]} />
        <FooterColumn title="Community" links={["GitHub Repository", "Documentation", "Privacy Policy", "Terms of Service"]} />

      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto px-6 border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] font-mono gap-2">
        <p>&copy; {new Date().getFullYear()} ChatCraft. Built with React, WebContainers & Socket.io.</p>
        <p>Enterprise Grade • Sub-millisecond Execution</p>
      </div>
    </footer>
  );
};

export default memo(Footer);
