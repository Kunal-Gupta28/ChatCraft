import { memo, useRef, useEffect } from "react";
import { Terminal, X, Trash2 } from "lucide-react";

const TerminalRunner = ({
  isOpen,
  onClose,
  terminalLogs = [],
  onClearLogs,
}) => {
  const terminalEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, terminalLogs]);

  if (!isOpen) return null;

  return (
    <div className="h-44 bg-[#050811] border-t border-slate-800/80 flex flex-col shrink-0 font-mono text-[11px] select-none">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#090d18] border-b border-slate-800/60 text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal size={13} className="text-cyan-400" />
          <span className="font-bold text-slate-200">WebContainer Terminal Logs</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onClearLogs}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            title="Clear Terminal"
          >
            <Trash2 size={12} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            title="Close Terminal"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      <div className="flex-1 p-3 overflow-y-auto space-y-1 text-slate-300 font-mono leading-relaxed select-text">
        {terminalLogs.map((log, idx) => (
          <div key={idx} className="break-words">
            {log.type === "cmd" ? (
              <span className="text-cyan-400 font-bold">$ {log.text}</span>
            ) : log.type === "err" ? (
              <span className="text-red-400">{log.text}</span>
            ) : log.type === "sys" ? (
              <span className="text-emerald-400 font-semibold">{log.text}</span>
            ) : (
              <span>{log.text}</span>
            )}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
};

export default memo(TerminalRunner);
