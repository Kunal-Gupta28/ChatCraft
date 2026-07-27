import { Link, NavLink } from "react-router-dom";
import { Code2, ArrowRight } from "lucide-react";
import ActionButton from "./ActionButton";

const Header = () => {
  return (
    <header className="w-full sticky top-0 z-50 bg-[#080b11]/80 backdrop-blur-2xl border-b border-slate-800/80 px-4 sm:px-8 lg:px-12 py-4 flex justify-between items-center transition select-none">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2 text-xl md:text-2xl font-black tracking-tight cursor-pointer">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 border border-blue-400/30 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <Code2 size={20} />
        </div>
        <span className="text-white">
          Chat<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Craft</span>
        </span>
      </Link>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-2 text-xs font-semibold">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `px-3.5 py-1.5 rounded-xl transition-all ${
              isActive
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/features"
          className={({ isActive }) =>
            `px-3.5 py-1.5 rounded-xl transition-all ${
              isActive
                ? "bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`
          }
        >
          Features
        </NavLink>

        <NavLink
          to="/how-it-works"
          className={({ isActive }) =>
            `px-3.5 py-1.5 rounded-xl transition-all ${
              isActive
                ? "bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`
          }
        >
          How it Works
        </NavLink>

        <NavLink
          to="/architecture"
          className={({ isActive }) =>
            `px-3.5 py-1.5 rounded-xl transition-all ${
              isActive
                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`
          }
        >
          Architecture
        </NavLink>

        <a
          href="https://github.com/Kunal-Gupta28/ChatCraft"
          target="_blank"
          rel="noreferrer"
          className="px-3.5 py-1.5 rounded-xl text-slate-400 hover:text-slate-200 border border-transparent transition-all"
        >
          Docs & GitHub
        </a>
      </nav>

      {/* Action CTA */}
      <div className="flex items-center gap-3">
        <ActionButton
          to="/auth/login"
          variant="header"
          className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 border border-blue-500/30 cursor-pointer flex items-center gap-1.5"
        >
          <span>Start Crafting</span>
          <ArrowRight size={14} />
        </ActionButton>
      </div>
    </header>
  );
};

export default Header;
