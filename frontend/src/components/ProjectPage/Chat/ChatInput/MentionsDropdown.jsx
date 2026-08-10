import { memo } from "react";
import { Bot } from "lucide-react";

const MentionsDropdown = ({
  isOpen,
  show,
  mentions,
  filteredMentions,
  selectedIndex = 0,
  onSelectMention,
  popoverRef,
}) => {
  const visible = isOpen ?? show;
  const list = mentions ?? filteredMentions ?? [];

  if (!visible || list.length === 0) return null;

  return (
    <div
      ref={popoverRef}
      className="absolute bottom-full mb-2.5 left-2 z-50 min-w-[200px] max-h-48 overflow-y-auto bg-[#0c101a]/98 border border-slate-700/80 shadow-2xl rounded-2xl p-1.5 backdrop-blur-2xl select-none animate-in fade-in zoom-in-95 duration-150 divide-y divide-slate-800/50"
    >
      <div className="px-2 py-1 text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">
        Mentions
      </div>
      <div className="pt-1 space-y-0.5">
        {list.map((candidate, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <button
              key={candidate.username}
              type="button"
              onMouseDown={(e) => {
                // Prevent textarea blur before click finishes
                e.preventDefault();
                onSelectMention?.(candidate);
              }}
              className={`flex items-center gap-2 w-full px-2.5 py-1.5 rounded-xl text-xs transition cursor-pointer text-left ${
                isSelected
                  ? "bg-cyan-500/20 text-cyan-200 border border-cyan-400/40"
                  : "text-slate-300 hover:bg-slate-800/60"
              }`}
            >
              {candidate.isAI ? (
                <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shrink-0">
                  <Bot size={12} />
                </div>
              ) : candidate.profilePic ? (
                <img
                  src={candidate.profilePic}
                  alt={candidate.username}
                  className="w-5 h-5 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                  {candidate.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-semibold truncate">@{candidate.username}</span>
                {candidate.name && candidate.name !== candidate.username && (
                  <span className="text-[9px] text-slate-400 truncate">{candidate.name}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default memo(MentionsDropdown);
