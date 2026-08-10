import { memo } from "react";
import { CornerDownRight, Pin } from "lucide-react";
import { renderMessageWithMentions, groupReactions } from "./helpers.jsx";
import AudioPlayer from "./AudioPlayer";
import MessageContextMenu from "./MessageContextMenu";

const UserMessageCard = ({
  msg,
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
  currentUser,
  isDeleting,
}) => {
  const reactionGroups = groupReactions(msg.reactions);

  return (
    <div
      id={`msg-${msg._id || msg.id}`}
      className={`group relative flex items-start justify-end gap-2 my-2 select-none transition-all duration-150 ${
        showMenu || showReactions ? "z-40" : "z-0"
      } ${isDeleting ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}`}
    >
      <MessageContextMenu
        isMine={isMine}
        isAudioMessage={isAudioMessage}
        isPinned={isPinned}
        copied={copied}
        formattedTime={formattedTime}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        showReactions={showReactions}
        setShowReactions={setShowReactions}
        handleCopy={handleCopy}
        handleTogglePin={handleTogglePin}
        handleStartEdit={handleStartEdit}
        handleDelete={handleDelete}
        handleReaction={handleReaction}
        startReplyMessage={startReplyMessage}
        msg={msg}
        alignLeft={true}
      />

      <div className="max-w-[85%] sm:max-w-[75%] flex flex-col items-end">
        {/* Reply Preview */}
        {msg.replyTo && (
          <div className="mb-1 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-800 text-[10px] text-slate-400 font-mono shadow-xs">
            <CornerDownRight size={10} className="text-cyan-400 shrink-0" />
            <span className="font-semibold text-slate-300">{msg.replyTo.senderName}:</span>
            <span className="truncate max-w-[150px]">{msg.replyTo.message}</span>
          </div>
        )}

        {/* Pinned Tag Banner */}
        {isPinned && (
          <div className="mb-1 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/15 border border-amber-400/35 text-[9px] font-bold text-amber-300 shadow-xs">
            <Pin size={10} className="fill-amber-300 shrink-0" />
            <span>Pinned to chat</span>
          </div>
        )}

        {/* Main Message Bubble */}
        <div
          className={`relative rounded-2xl rounded-tr-none ${
            isAudioMessage
              ? "p-0 bg-transparent border-0 shadow-none"
              : `bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-3.5 py-2.5 text-xs shadow-lg font-sans break-words max-w-full ${
                  isPinned ? "border-2 border-amber-400/50 shadow-amber-500/10" : ""
                }`
          }`}
        >
          {isAudioMessage ? (
            <AudioPlayer audioUrl={msg.audioUrl} duration={msg.audioDuration} isMine={isMine} />
          ) : (
            <>
              {renderMessageWithMentions(msg.message, currentUser?.username)}
              <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-cyan-100/70 font-mono">
                {msg.isEdited && <span className="italic">edited •</span>}
                <span>{formattedTime}</span>
              </div>
            </>
          )}
        </div>

        {/* Reactions Pills */}
        {reactionGroups.length > 0 && (
          <div className="mt-1 flex flex-wrap items-center justify-end gap-1">
            {reactionGroups.map(({ emoji, count }) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleReaction(emoji)}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-[10px] font-bold text-slate-200 hover:bg-slate-800 transition cursor-pointer shadow-xs"
              >
                <span>{emoji}</span>
                {count > 1 && <span className="text-[9px] text-slate-400 font-mono">{count}</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(UserMessageCard);
