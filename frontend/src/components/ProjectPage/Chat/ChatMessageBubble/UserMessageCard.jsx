import { memo } from "react";
import { CornerDownRight, Pin } from "lucide-react";
import { renderMessageWithMentions } from "./helpers.jsx";
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
  return (
    <div
      id={`msg-${msg._id}`}
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
        {msg.replyTo && (
          <div className="mb-1 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] text-slate-400 font-mono">
            <CornerDownRight size={10} className="text-cyan-400 shrink-0" />
            <span className="font-semibold text-slate-300">{msg.replyTo.senderName}:</span>
            <span className="truncate max-w-[150px]">{msg.replyTo.message}</span>
          </div>
        )}

        <div className={`relative rounded-2xl rounded-tr-none ${
          isAudioMessage
            ? "p-0 bg-transparent border-0 shadow-none"
            : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-3.5 py-2.5 text-xs shadow-lg font-sans break-words max-w-full"
        }`}>
          {isPinned && <Pin size={11} className="absolute -top-1.5 -left-1.5 text-amber-300 fill-amber-300 drop-shadow z-10" />}
          {isAudioMessage ? (
            <AudioPlayer audioUrl={msg.audioUrl} duration={msg.audioDuration} isMine={isMine} />
          ) : (
            <>
              {renderMessageWithMentions(msg.message, currentUser?.username)}
              <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-cyan-100/70 font-mono">
                <span>{formattedTime}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(UserMessageCard);
