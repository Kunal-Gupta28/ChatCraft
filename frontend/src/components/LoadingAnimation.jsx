import { Code2 } from "lucide-react";

export default function LoadingAnimation() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#06080e]/95 backdrop-blur-md z-[9999] select-none font-sans overflow-hidden">
      <div className="flex flex-col items-center gap-3 bg-[#090d16]/80 border border-slate-800/80 px-6 py-5 rounded-2xl shadow-xl backdrop-blur-lg animate-fadeIn">
        {/* Minimal Pulsing Logo Mark */}
        <div className="relative flex items-center justify-center">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-sm animate-pulse">
            <Code2 size={20} className="text-blue-400" />
          </div>
        </div>

        {/* Minimal Text Label */}
        <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping shrink-0" />
          <span>Loading...</span>
        </div>

        {/* Sleek Minimal Progress Line */}
        <div className="w-28 h-0.5 bg-slate-800 rounded-full overflow-hidden relative mt-1">
          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full animate-pulse w-full" />
        </div>
      </div>
    </div>
  );
}
