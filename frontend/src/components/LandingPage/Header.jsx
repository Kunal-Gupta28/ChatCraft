import { memo } from "react";
import { Link, NavLink } from "react-router-dom";
import { Code2, ArrowRight } from "lucide-react";
import ActionButton from "./ActionButton";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/features", label: "Features" },
  { to: "/how-it-works", label: "How it Works" },
  { to: "/architecture", label: "Architecture" },
  { to: "/security", label: "Security" },
];

const Header = () => {
  return (
    <header className="w-full sticky top-0 z-50 bg-[#06080e]/90 backdrop-blur-2xl border-b border-slate-800/80 px-4 sm:px-8 lg:px-12 py-3 flex justify-between items-center transition select-none font-sans">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight cursor-pointer">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 border border-indigo-400/30 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
          <Code2 size={18} />
        </div>
        <span className="text-white font-extrabold tracking-tight text-xl">
          Chat<span className="text-indigo-400">Craft</span>
        </span>
      </Link>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg transition-all ${
                isActive
                  ? "bg-slate-800/90 text-white border border-slate-700/80 shadow-sm font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}

        <a
          href="https://github.com/Kunal-Gupta28/ChatCraft"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent transition-all"
        >
          Docs & GitHub
        </a>
      </nav>

      {/* Primary CTA */}
      <div className="flex items-center gap-3">
        <ActionButton
          to="/auth/login"
          variant="primary"
          className="text-xs px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer flex items-center gap-1.5"
        >
          <span>Start Crafting</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </ActionButton>
      </div>
    </header>
  );
};

export default memo(Header);
