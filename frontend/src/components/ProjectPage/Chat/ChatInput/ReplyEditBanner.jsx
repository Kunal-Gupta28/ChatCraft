import { memo } from "react";
import { Pencil, CornerDownRight, X } from "lucide-react";

const ReplyEditBanner = ({
  editingMessage,
  cancelEditMessage,
  replyToMessage,
  cancelReplyMessage,
}) => {
  if (editingMessage) {
    return (
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-400/20 rounded-xl text-xs text-amber-200">
        <div className="flex items-center gap-1.5 truncate">
          <Pencil size={12} className="text-amber-400 shrink-0" />
          <span className="font-bold shrink-0">Editing:</span>
          <span className="truncate text-slate-300 font-mono text-[11px]">
            {editingMessage.message}
          </span>
        </div>
        <button
          type="button"
          onClick={cancelEditMessage}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer shrink-0"
        >
          <X size={13} />
        </button>
      </div>
    );
  }

  if (replyToMessage) {
    return (
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-400/20 rounded-xl text-xs text-cyan-200">
        <div className="flex items-center gap-1.5 truncate">
          <CornerDownRight size={12} className="text-cyan-400 shrink-0" />
          <span className="font-bold shrink-0">Replying to {replyToMessage.senderName}:</span>
          <span className="truncate text-slate-300 font-mono text-[11px]">
            {replyToMessage.message}
          </span>
        </div>
        <button
          type="button"
          onClick={cancelReplyMessage}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer shrink-0"
        >
          <X size={13} />
        </button>
      </div>
    );
  }

  return null;
};

export default memo(ReplyEditBanner);
