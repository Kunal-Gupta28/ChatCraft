import { Code2 } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#06080e] z-[9999] select-none font-sans overflow-hidden">
      <div className="flex flex-col items-center gap-4 animate-fadeIn">
        <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-sm animate-pulse">
          <Code2 size={22} className="text-blue-400" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          ChatCraft
        </h1>

        <div className="w-32 h-0.5 bg-slate-800/80 rounded-full overflow-hidden relative mt-1">
          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full animate-pulse w-full" />
        </div>
      </div>
    </div>
  );
};

export default PageLoader;