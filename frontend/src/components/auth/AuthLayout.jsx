import { useNavigate } from "react-router-dom";
import { ArrowLeft, Code2 } from "lucide-react";
import BackgroundBlobs from "../BackgroundBlobs";

const AuthLayout = ({ title, subtitle, children }) => {
  const navigate = useNavigate();

  return (
    <div className="h-[100dvh] min-h-[100dvh] flex items-center justify-center bg-[#080b11] text-white select-none px-4 relative overflow-hidden">
      {/* Ambient Blobs */}
      <BackgroundBlobs />

      <div className="bg-[#0d121f]/80 border border-slate-800/80 p-7 sm:p-9 rounded-3xl shadow-2xl backdrop-blur-2xl w-full max-w-md relative z-10 overflow-hidden">
        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/")}
            aria-label="Go back to home"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition group cursor-pointer"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition" />
            <span>Home</span>
          </button>

          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-md">
              <Code2 size={18} />
            </div>
            <span className="text-white">Chat<span className="text-blue-400">Craft</span></span>
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-slate-400 text-xs sm:text-sm mt-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
