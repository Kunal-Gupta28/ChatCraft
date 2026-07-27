import { memo, useCallback } from "react";
import { Code2, Sparkles, Play } from "lucide-react";
import MarkdownWithCode from "./MarkdownWithCode";

const EditorPane = ({ activeFile, code, updateCode }) => {
  const handleChange = useCallback(
    (val) => {
      if (!activeFile) return;
      updateCode(activeFile, val);
    },
    [activeFile, updateCode]
  );

  // Zed / Cursor IDE grade empty workspace screen
  if (!activeFile)
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center p-6 text-center select-none bg-[#07090e] relative overflow-hidden">
        {/* Ambient Radial Glow */}
        <div className="absolute w-80 h-80 rounded-full bg-indigo-600/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-sm flex flex-col items-center">
          {/* Logo Badge */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/60 flex items-center justify-center text-blue-400 mb-4 shadow-xl shadow-blue-500/5">
            <Code2 size={24} />
          </div>

          {/* Title */}
          <h3 className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-1.5">
            ChatCraft Workspace
          </h3>

          <p className="text-slate-400 text-xs leading-relaxed mb-6 max-w-xs font-sans">
            Select a file from the explorer or prompt Gemini AI to generate code.
          </p>

          {/* Keybinding Shortcuts Grid */}
          <div className="w-full space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800/80 text-slate-300">
              <span className="flex items-center gap-2 text-slate-300 font-sans font-medium text-[11px]">
                <Sparkles size={13} className="text-purple-400" />
                Prompt AI
              </span>
              <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-purple-300 font-mono">
                @ai &lt;prompt&gt;
              </kbd>
            </div>

            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800/80 text-slate-300">
              <span className="flex items-center gap-2 text-slate-300 font-sans font-medium text-[11px]">
                <Play size={13} className="text-emerald-400" />
                Run Server
              </span>
              <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-emerald-300 font-mono">
                Click ▶ Run
              </kbd>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#080b11]">
      <MarkdownWithCode
        fileName={activeFile}
        code={code}
        onChange={handleChange}
      />
    </div>
  );
};

export default memo(EditorPane);