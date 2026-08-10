import { memo } from "react";
import { X, FileCode } from "lucide-react";

const PRESENCE_COLORS = ["#22d3ee", "#a78bfa", "#f59e0b", "#34d399", "#fb7185"];

const FileTab = ({ fileName, isActive, onClick, onClose, disabled, collaborators = [], isDirty = false }) => {
  const shortName = fileName.split("/").pop();

  return (
    <div
      onClick={!disabled ? () => onClick(fileName) : undefined}
      className={`flex px-3 py-1.5 rounded-lg items-center gap-2 select-none text-xs font-medium transition-all shrink-0 font-mono
        ${
          isActive
            ? "bg-[#111625] text-white border border-blue-500/40 shadow-sm"
            : "bg-[#090d16]/80 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 cursor-pointer border border-transparent"
        }
        ${disabled && "pointer-events-none opacity-40"}
      `}
    >
      <FileCode size={13} className={isActive ? "text-blue-400" : "text-slate-500"} />

      <span className="truncate max-w-[130px]">
        {shortName}
      </span>

      {isDirty && (
        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 shadow-sm shadow-amber-400/50" title="Unsaved local draft changes" />
      )}

      {collaborators.length > 0 && (
        <span
          className="flex -space-x-1"
          title={collaborators.map((presence) => `${presence.username} is editing`).join(", ")}
        >
          {collaborators.slice(0, 3).map((presence) => (
            <span
              key={presence.connectionId}
              className="h-2 w-2 rounded-full border border-slate-900"
              style={{ backgroundColor: PRESENCE_COLORS[presence.colorIndex % PRESENCE_COLORS.length] }}
            />
          ))}
        </span>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) onClose(fileName);
        }}
        className="p-0.5 rounded hover:bg-slate-700/80 hover:text-rose-400 transition cursor-pointer"
      >
        <X size={12} className={disabled ? "text-slate-600" : "text-slate-400"} />
      </button>
    </div>
  );
};

export default memo(FileTab);
