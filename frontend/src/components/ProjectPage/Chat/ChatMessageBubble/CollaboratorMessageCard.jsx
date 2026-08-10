import { memo } from "react";
import { Pin } from "lucide-react";
import { renderMessageWithMentions } from "./helpers.jsx";
import AudioPlayer from "./AudioPlayer";
import MessageContextMenu from "./MessageContextMenu";
import CodeSuggestionModal from "../CodeSuggestionModal";

const CollaboratorMessageCard = ({
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
  avatarPic,
  initial,
  isDeleting,
  showCodeSuggestion,
  setShowCodeSuggestion,
  codeSuggestionObj,
  fileTree,
  handleApplySuggestion,
  isApplyingSuggestion,
  applySuggestionError,
}) => {
  return (
    <div
      id={`msg-${msg._id}`}
      className={`group relative flex items-start gap-2.5 my-2 select-none transition-all duration-150 ${
        showMenu || showReactions ? "z-40" : "z-0"
      } ${isDeleting ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}`}
    >
      <div className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold shrink-0 mt-0.5 overflow-hidden">
        {avatarPic ? (
          <img src={avatarPic} alt={msg.senderName} className="w-full h-full object-cover" />
        ) : (
          initial
        )}
      </div>

      <div className="max-w-[85%] sm:max-w-[75%] flex flex-col">
        <div className="flex items-center gap-2 mb-1 px-0.5">
          <span className="text-[11px] font-bold text-slate-300">{msg.senderName}</span>
          <span className="text-[9px] font-mono text-slate-500">{formattedTime}</span>
        </div>

        <div className={`relative rounded-2xl rounded-tl-none ${
          isAudioMessage
            ? "p-0 bg-transparent border-0 shadow-none"
            : "bg-[#0d121f] border border-slate-800 text-slate-200 px-3.5 py-2.5 text-xs shadow-md font-sans break-words max-w-full"
        }`}>
          {isPinned && <Pin size={11} className="absolute -top-1.5 -right-1.5 text-amber-300 fill-amber-300 drop-shadow z-10" />}
          {isAudioMessage ? (
            <AudioPlayer audioUrl={msg.audioUrl} duration={msg.audioDuration} isMine={isMine} />
          ) : (
            renderMessageWithMentions(msg.message, currentUser?.username)
          )}
        </div>
      </div>

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
        alignLeft={false}
      />

      {showCodeSuggestion && (
        <CodeSuggestionModal
          isOpen={showCodeSuggestion}
          onClose={() => setShowCodeSuggestion(false)}
          codeSuggestion={codeSuggestionObj}
          fileTree={fileTree}
          onApply={handleApplySuggestion}
          isApplying={isApplyingSuggestion}
          error={applySuggestionError}
        />
      )}
    </div>
  );
};

export default memo(CollaboratorMessageCard);
