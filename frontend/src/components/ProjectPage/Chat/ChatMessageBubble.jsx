import { useCallback, memo, useMemo } from "react";
import { Bot, Pencil, Trash2 } from "lucide-react";
import { useUser } from "../../../contexts/user.context";
import { useProject } from "../../../contexts/project.context";
import { useChat } from "../../../contexts/chat.context";

// Function to render text with highlighted @mentions
const renderMessageWithMentions = (text, currentUsername) => {
  if (typeof text !== "string") return text;

  // Split text by @mentions (e.g. @ai or @username)
  const parts = text.split(/(@[a-zA-Z0-9_-]+)/g);

  return parts.map((part, index) => {
    if (part.startsWith("@")) {
      const isAI = part.toLowerCase() === "@ai";
      const isMe = currentUsername && part.toLowerCase() === `@${currentUsername.toLowerCase()}`;
      return (
        <span
          key={index}
          className={`px-1.5 py-0.5 mx-0.5 rounded-md font-semibold text-[11px] font-mono inline-flex items-center gap-1 border shadow-xs ${
            isMe
              ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
              : isAI
              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
              : "bg-blue-500/25 text-blue-300 border-blue-500/50"
          }`}
        >
          {part}
        </span>
      );
    }
    return part;
  });
};

const ChatMessageBubble = ({ msg, isMine }) => {
  const { user: currentUser } = useUser();
  const { project } = useProject();
  const { startEditMessage, handleDeleteMessage } = useChat();

  const formattedTime = useMemo(() => {
    if (!msg?.createdAt) return "";
    const date = new Date(msg.createdAt);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, [msg?.createdAt]);

  const isAI = msg.senderName === "AI";

  // Check if current user is mentioned in this message (exact match)
  const isMentionedMe = useMemo(() => {
    if (!currentUser?.username || !msg?.message || isMine) return false;
    const mentionRegex = new RegExp(`@${currentUser.username}\\b`, "i");
    return mentionRegex.test(msg.message);
  }, [currentUser?.username, msg?.message, isMine]);

  // Find user avatar picture
  const matchedUser = useMemo(() => {
    if (isMine) return currentUser;
    return project?.users?.find(
      (u) => String(u._id) === String(msg.senderId) || u.username === msg.senderName
    );
  }, [isMine, currentUser, project?.users, msg.senderId, msg.senderName]);

  const avatarPic = matchedUser?.profilePic;
  const initial = (isMine ? currentUser?.username : msg.senderName)?.charAt(0)?.toUpperCase() || "U";

  const handleStartEdit = useCallback(() => {
    startEditMessage({ id: msg._id || msg.id, message: msg.message });
  }, [startEditMessage, msg]);

  const handleDelete = useCallback(() => {
    handleDeleteMessage(msg._id || msg.id);
  }, [handleDeleteMessage, msg._id, msg.id]);

  // 1. GEMINI AI ASSISTANT MESSAGE
  if (isAI) {
    return (
      <div id={`msg-${msg._id}`} className="flex items-start gap-2.5 my-2.5 select-none justify-start">
        {/* Avatar + Name + Time Column */}
        <div className="flex flex-col items-center shrink-0 w-11 text-center">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600 border border-cyan-400/40 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Bot size={15} />
          </div>
          <span className="text-[10px] font-bold text-cyan-300 tracking-tight truncate w-full mt-1">
            Gemini
          </span>
          <time className="text-[9px] text-slate-400 font-mono tracking-tighter">
            {formattedTime}
          </time>
        </div>

        {/* Message Bubble */}
        <div className="max-w-[78%] bg-[#0d1322] border border-cyan-500/30 px-3.5 py-2.5 rounded-2xl rounded-tl-xs shadow-xl shadow-cyan-950/20 backdrop-blur-2xl">
          <div className="text-xs sm:text-sm break-words leading-relaxed text-slate-100 font-sans whitespace-pre-wrap">
            {renderMessageWithMentions(msg.message, currentUser?.username)}
          </div>
        </div>
      </div>
    );
  }

  // 2. MY MESSAGE (LOGGED IN USER)
  if (isMine) {
    return (
      <div id={`msg-${msg._id}`} className="group relative flex items-start justify-end gap-2.5 my-2 select-none">
        {/* Hover Action Bar: Edit & Delete */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -top-3.5 right-14 flex items-center gap-1 bg-[#090d16] border border-slate-800 rounded-lg px-1.5 py-0.5 shadow-xl backdrop-blur-xl z-10">
          <button
            type="button"
            onClick={handleStartEdit}
            title="Edit Message"
            className="p-1 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition cursor-pointer"
          >
            <Pencil size={12} />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            title="Delete Message"
            className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800 transition cursor-pointer"
          >
            <Trash2 size={12} />
          </button>
        </div>

        {/* Message Bubble */}
        <div className="max-w-[78%] px-3.5 py-2.5 rounded-2xl shadow-lg bg-[#1c2438] text-slate-100 border border-indigo-500/35 rounded-tr-xs shadow-indigo-950/20 relative">
          <div className="text-xs sm:text-sm break-words leading-relaxed whitespace-pre-wrap">
            {renderMessageWithMentions(msg.message, currentUser?.username)}
          </div>
          {msg.isEdited && (
            <span className="block text-[9px] text-indigo-300/50 font-mono text-right mt-0.5 italic">
              (edited)
            </span>
          )}
        </div>

        {/* Avatar + Name + Time Column */}
        <div className="flex flex-col items-center shrink-0 w-11 text-center">
          {avatarPic ? (
            <img
              src={avatarPic}
              alt="My Avatar"
              className="w-8 h-8 rounded-full object-cover border border-indigo-500/50 shadow-md"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 border border-indigo-400/40 flex items-center justify-center text-xs font-bold text-white shadow-md">
              {initial}
            </div>
          )}
          <span className="text-[10px] font-bold text-indigo-300 tracking-tight truncate w-full mt-1">
            You
          </span>
          <time className="text-[9px] text-indigo-300/70 font-mono tracking-tighter">
            {formattedTime}
          </time>
        </div>
      </div>
    );
  }

  // 3. OTHER COLLABORATOR MESSAGE
  return (
    <div id={`msg-${msg._id}`} className="flex items-start justify-start gap-2.5 my-2 select-none">
      {/* Avatar + Name + Time Column */}
      <div className="flex flex-col items-center shrink-0 w-11 text-center">
        {avatarPic ? (
          <img
            src={avatarPic}
            alt={msg.senderName}
            className="w-8 h-8 rounded-full object-cover border border-slate-700 shadow-md"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-900 to-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-indigo-300 shadow-md">
            {initial}
          </div>
        )}
        <span className="text-[10px] font-bold text-slate-300 capitalize truncate w-full mt-1">
          {msg.senderName}
        </span>
        <time className="text-[9px] text-slate-400 font-mono tracking-tighter">
          {formattedTime}
        </time>
      </div>

      {/* Message Bubble */}
      <div
        className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl shadow-md transition-all ${
          isMentionedMe
            ? "bg-[#141a29] text-slate-100 border border-amber-500/50 ring-1 ring-amber-500/30 rounded-tl-xs shadow-amber-500/10"
            : "bg-[#111726] text-slate-100 border border-slate-800/90 rounded-tl-xs"
        }`}
      >
        <div className="text-xs sm:text-sm break-words leading-relaxed whitespace-pre-wrap">
          {renderMessageWithMentions(msg.message, currentUser?.username)}
        </div>
      </div>
    </div>
  );
};

export default memo(ChatMessageBubble);