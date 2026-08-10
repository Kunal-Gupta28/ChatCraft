import { memo } from "react";
import { AtSign, ChevronDown } from "lucide-react";

const UnreadMentionsBanner = ({
  unreadCount,
  onScrollToMention,
  onDismissMentions,
}) => {
  if (unreadCount === 0) return null;

  return (
    <div className="sticky top-2 z-30 flex items-center justify-between gap-2 px-3 py-1.5 mx-3 my-1 bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center gap-1.5 text-xs">
        <AtSign size={14} className="shrink-0 animate-bounce" />
        <span>
          You were mentioned in {unreadCount} message{unreadCount > 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onScrollToMention}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-950 text-amber-300 text-[10px] font-bold transition cursor-pointer active:scale-95"
        >
          <span>Jump</span>
          <ChevronDown size={12} />
        </button>
        <button
          type="button"
          onClick={onDismissMentions}
          className="px-2 py-1 rounded-lg bg-slate-950/40 hover:bg-slate-950/70 text-slate-200 text-[10px] font-semibold transition cursor-pointer"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default memo(UnreadMentionsBanner);
