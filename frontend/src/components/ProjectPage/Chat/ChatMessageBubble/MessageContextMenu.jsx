import { memo, useRef, useEffect } from "react";
import { Copy, Check, Pin, Pencil, RotateCcw, Smile, Reply, MoreVertical } from "lucide-react";

const QUICK_REACTIONS = ["👍", "❤️", "🔥", "😂", "🎉", "🚀"];

const MessageContextMenu = ({
  isMine,
  isAudioMessage,
  isPinned,
  copied,
  formattedTime,
  showMenu,
  setShowMenu,
  showReactions,
  setShowReactions,
  handleCopy,
  handleTogglePin,
  handleStartEdit,
  handleDelete,
  handleReaction,
  startReplyMessage,
  msg,
  alignLeft = true,
}) => {
  const menuRef = useRef(null);
  const reactionsRef = useRef(null);

  useEffect(() => {
    if (!showMenu && !showReactions) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
      if (reactionsRef.current && !reactionsRef.current.contains(e.target)) {
        setShowReactions(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowMenu(false);
        setShowReactions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showMenu, showReactions, setShowMenu, setShowReactions]);

  const isBarActive = showMenu || showReactions;

  return (
    <div
      className={`transition-all duration-200 relative flex items-center gap-0.5 bg-[#090d16]/95 border border-slate-700/80 rounded-full px-2 py-1 shadow-2xl backdrop-blur-2xl shrink-0 self-center z-30 ${
        isBarActive
          ? "opacity-100 pointer-events-auto scale-100 shadow-cyan-500/10 border-cyan-500/40"
          : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto scale-95 group-hover:scale-100"
      }`}
    >
      {/* Context Menu Options Popover */}
      {showMenu && (
        <div
          ref={menuRef}
          className={`absolute z-50 bottom-full mb-2.5 ${
            alignLeft ? "left-0" : "right-0"
          } w-44 bg-[#090d16]/98 border border-slate-700/80 shadow-2xl shadow-cyan-950/60 rounded-2xl p-1.5 backdrop-blur-2xl select-none animate-in fade-in zoom-in-95 duration-150`}
        >
          {/* Pointer Arrow */}
          <div
            className={`absolute -bottom-1.5 ${
              alignLeft ? "left-4" : "right-4"
            } w-3 h-3 bg-[#090d16] border-r border-b border-slate-700/80 rotate-45`}
          />

          <div className="px-2.5 py-1 text-[10px] font-mono text-cyan-400/80 border-b border-slate-800/80 mb-1 flex items-center justify-between">
            <span>Options</span>
            <span className="text-[9px] text-slate-500">{formattedTime || ""}</span>
          </div>

          <div className="flex flex-col gap-0.5 relative z-10">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center justify-between w-full px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800/80 rounded-xl transition cursor-pointer"
            >
              <span>{copied ? "Copied!" : "Copy text"}</span>
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} className="text-slate-400" />}
            </button>

            <button
              type="button"
              onClick={handleTogglePin}
              className="flex items-center justify-between w-full px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800/80 rounded-xl transition cursor-pointer"
            >
              <span>{isPinned ? "Unpin message" : "Pin message"}</span>
              <Pin size={13} className={isPinned ? "text-amber-300 fill-amber-300" : "text-slate-400"} />
            </button>

            {isMine && !isAudioMessage && (
              <button
                type="button"
                onClick={() => {
                  handleStartEdit();
                  setShowMenu(false);
                }}
                className="flex items-center justify-between w-full px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800/80 rounded-xl transition cursor-pointer"
              >
                <span>Edit message</span>
                <Pencil size={13} className="text-slate-400" />
              </button>
            )}

            {isMine && (
              <button
                type="button"
                onClick={() => {
                  handleDelete();
                  setShowMenu(false);
                }}
                className="flex items-center justify-between w-full px-2.5 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/15 rounded-xl transition cursor-pointer mt-0.5 border-t border-slate-800/80 pt-1.5"
              >
                <span>Unsend</span>
                <RotateCcw size={13} className="text-red-400" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quick Emoji Reactions Picker Popover */}
      {showReactions && (
        <div
          ref={reactionsRef}
          className={`absolute z-50 bottom-full mb-2.5 ${
            alignLeft ? "left-0" : "right-0"
          } flex items-center gap-1 p-1.5 bg-[#090d16]/98 border border-slate-700/80 shadow-2xl shadow-cyan-950/60 rounded-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150`}
        >
          {/* Pointer Arrow */}
          <div
            className={`absolute -bottom-1.5 ${
              alignLeft ? "left-4" : "right-4"
            } w-3 h-3 bg-[#090d16] border-r border-b border-slate-700/80 rotate-45`}
          />

          <div className="flex items-center gap-1 relative z-10">
            {QUICK_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleReaction(emoji)}
                className="w-8 h-8 rounded-xl hover:bg-slate-800/90 flex items-center justify-center text-base transition-transform hover:scale-130 active:scale-95 cursor-pointer"
                title={`React ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Bar Trigger Buttons */}
      <button
        type="button"
        onClick={() => {
          setShowMenu((prev) => !prev);
          setShowReactions(false);
        }}
        className={`p-1.5 rounded-full transition cursor-pointer ${
          showMenu ? "text-cyan-400 bg-cyan-500/20" : "text-slate-400 hover:text-white hover:bg-slate-800/80"
        }`}
        title="More Options"
      >
        <MoreVertical size={13} />
      </button>

      <button
        type="button"
        onClick={() => {
          setShowReactions((prev) => !prev);
          setShowMenu(false);
        }}
        className={`p-1.5 rounded-full transition cursor-pointer ${
          showReactions ? "text-cyan-400 bg-cyan-500/20" : "text-slate-400 hover:text-white hover:bg-slate-800/80"
        }`}
        title="Add Reaction"
      >
        <Smile size={13} />
      </button>

      {startReplyMessage && (
        <button
          type="button"
          onClick={() => {
            startReplyMessage({
              id: msg._id ?? msg.id,
              senderName: msg.senderName,
              message: msg.message || "Voice Note",
            });
            setShowMenu(false);
            setShowReactions(false);
          }}
          className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition cursor-pointer"
          title="Reply"
        >
          <Reply size={13} />
        </button>
      )}
    </div>
  );
};

export default memo(MessageContextMenu);
