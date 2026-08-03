import { useState, useRef, useEffect, useCallback, memo, useMemo } from "react";
import {
  Bot,
  Pencil,
  Copy,
  RotateCcw,
  MoreVertical,
  Pin,
  Reply,
  Smile,
  Check,
  CornerDownRight,
  FileCode2,
  Mic,
} from "lucide-react";
import { useUser } from "../../../contexts/user.context";
import { useProject } from "../../../contexts/project.context";
import { useChat } from "../../../contexts/chat.context";
import { useCodeEditor } from "../../../contexts/codeEditor.context";
import { sendMessage } from "../../../config/socket";
import CodeSuggestionModal from "./CodeSuggestionModal";

const QUICK_REACTIONS = ["👍", "❤️", "🔥", "😂", "🎉", "🚀"];

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
          className={`inline-flex items-center rounded-md px-1.5 py-0.5 mx-0.5 text-[11px] font-semibold leading-none border ${
            isMe
              ? "bg-amber-400/10 text-amber-200 border-amber-300/25"
              : isAI
              ? "bg-cyan-400/10 text-cyan-200 border-cyan-300/25"
              : "bg-slate-700/35 text-slate-200 border-slate-600/35"
          }`}
        >
          {part}
        </span>
      );
    }
    return part;
  });
};

const formatAudioDuration = (seconds) => {
  const totalSeconds = Math.max(0, Math.round(Number(seconds) || 0));
  return `0:${String(totalSeconds).padStart(2, "0")}`;
};

const VoiceMessagePlayer = ({ audioUrl, duration }) => {
  if (!audioUrl) return null;

  return (
    <div className="min-w-[210px] rounded-xl border border-cyan-300/15 bg-slate-950/30 px-2.5 py-2">
      <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-200">
        <Mic size={11} />
        <span>Voice note</span>
        <span className="ml-auto font-mono text-slate-500 normal-case tracking-normal">
          {formatAudioDuration(duration)}
        </span>
      </div>
      <audio controls preload="metadata" src={audioUrl} className="h-8 w-full max-w-[250px]" />
    </div>
  );
};

const ChatMessageBubble = ({ msg, isMine }) => {
  const { user: currentUser } = useUser();
  const { project } = useProject();
  const { fileTree, setActiveSuggestion } = useCodeEditor();
  const {
    startEditMessage,
    handleDeleteMessage,
    handleTogglePinMessage,
    startReplyMessage,
    handleToggleReaction,
  } = useChat();

  const [showMenu, setShowMenu] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCodeSuggestion, setShowCodeSuggestion] = useState(false);
  const [isApplyingSuggestion, setIsApplyingSuggestion] = useState(false);
  const [applySuggestionError, setApplySuggestionError] = useState("");
  const [isSuggestionApplied, setIsSuggestionApplied] = useState(false);
  const isPinned = Boolean(msg.isPinned);
  const isTranslated = false;

  const menuRef = useRef(null);
  const reactionsRef = useRef(null);

  const formattedTime = useMemo(() => {
    if (!msg?.createdAt) return "";
    const date = new Date(msg.createdAt);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, [msg?.createdAt]);

  const isAI = msg.senderName === "AI" || msg.senderName === "Gemini";
  const isAudioMessage = msg.type === "audio" && Boolean(msg.audioUrl);

  const codeSuggestionObj = useMemo(() => {
    if (msg?.codeSuggestion?.fileTree) return msg.codeSuggestion;
    if (msg?.fileTree) return { fileTree: msg.fileTree, buildCommand: msg.buildCommand, startCommand: msg.startCommand };
    return null;
  }, [msg]);

  const hasCodeSuggestion = Boolean(codeSuggestionObj?.fileTree);

  // Check if current user is mentioned in this message
  const isMentionedMe = useMemo(() => {
    if (!currentUser?.username || !msg?.message || isMine) return false;
    const mentionRegex = new RegExp(`@${currentUser.username}\\b`, "i");
    return mentionRegex.test(String(msg.message));
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

  // Reset popovers when message ID changes
  useEffect(() => {
    setShowMenu(false);
    setShowReactions(false);
    setIsDeleting(false);
    setShowCodeSuggestion(false);
    setIsApplyingSuggestion(false);
    setApplySuggestionError("");
    setIsSuggestionApplied(false);
  }, [msg._id, msg.id]);

  const handleStartEdit = useCallback(() => {
    startEditMessage({ id: msg._id ?? msg.id, message: msg.message });
  }, [startEditMessage, msg]);

  const handleDelete = useCallback(() => {
    setShowMenu(false);
    setShowReactions(false);
    setIsDeleting(true);
    setTimeout(() => {
      handleDeleteMessage(msg._id ?? msg.id);
    }, 160);
  }, [handleDeleteMessage, msg._id, msg.id]);

  const groupedReactions = useMemo(() => {
    const list = Array.isArray(msg?.reactions) ? msg.reactions : [];
    const map = new Map();
    list.forEach((r) => {
      const emoji = r.emoji;
      if (!emoji) return;
      if (!map.has(emoji)) {
        map.set(emoji, { count: 0, users: [], hasMine: false });
      }
      const item = map.get(emoji);
      item.count += 1;
      if (r.username) item.users.push(r.username);
      if (currentUser?._id && String(r.userId) === String(currentUser._id)) {
        item.hasMine = true;
      }
    });
    return Array.from(map.entries()).map(([emoji, data]) => ({ emoji, ...data }));
  }, [msg?.reactions, currentUser?._id]);

  const handleCopy = useCallback(() => {
    if (typeof msg?.message === "string") {
      navigator.clipboard.writeText(msg.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
    setShowMenu(false);
  }, [msg?.message]);

  const handleReply = useCallback(() => {
    startReplyMessage(msg);
    setShowMenu(false);
  }, [startReplyMessage, msg]);

  const handleTogglePin = useCallback(() => {
    handleTogglePinMessage(msg._id ?? msg.id);
    setShowMenu(false);
  }, [handleTogglePinMessage, msg._id, msg.id]);

  const handleAddReaction = useCallback((emoji) => {
    handleToggleReaction(msg._id ?? msg.id, emoji);
    setShowReactions(false);
  }, [handleToggleReaction, msg._id, msg.id]);

  const handleApplySuggestion = useCallback(
    async ({ fileTree: suggestedFileTree, buildCommand, startCommand }) => {
      setIsApplyingSuggestion(true);
      setApplySuggestionError("");

      try {
        await sendMessage("project-files-apply", {
          fileTree: suggestedFileTree,
          buildCommand,
          startCommand,
        });
        setIsSuggestionApplied(true);
        setShowCodeSuggestion(false);
      } catch (error) {
        setApplySuggestionError(error.message || "Could not apply the AI suggestion.");
      } finally {
        setIsApplyingSuggestion(false);
      }
    },
    [],
  );

  // Close context menu & reactions popover on click outside or Esc
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
  }, [showMenu, showReactions]);

  const renderContextMenu = (alignRight = true) => (
    <div
      ref={menuRef}
      className={`absolute z-40 bottom-full mb-1.5 ${
        alignRight ? "right-0" : "left-0"
      } w-44 bg-[#111827]/95 border border-slate-700/70 shadow-xl rounded-xl p-1 backdrop-blur-2xl select-none animate-in fade-in zoom-in-95 duration-150`}
    >
      <div className="px-2.5 py-1.5 text-[10px] font-medium text-slate-500 border-b border-slate-800/80 mb-1">
        {formattedTime || "Message Options"}
      </div>

      <div className="flex flex-col gap-0.5">
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center justify-between w-full px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition cursor-pointer"
        >
          <span>{copied ? "Copied!" : "Copy"}</span>
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-slate-400" />}
        </button>

        <button
          type="button"
          onClick={handleTogglePin}
          className="flex items-center justify-between w-full px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition cursor-pointer"
        >
          <span>{isPinned ? "Unpin" : "Pin"}</span>
          <Pin size={14} className={isPinned ? "text-amber-300 fill-amber-300" : "text-slate-400"} />
        </button>

        {isMine && !isAudioMessage && (
          <button
            type="button"
            onClick={() => {
              handleStartEdit();
              setShowMenu(false);
            }}
            className="flex items-center justify-between w-full px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition cursor-pointer"
          >
            <span>Edit</span>
            <Pencil size={14} className="text-slate-400" />
          </button>
        )}

        {isMine && (
          <button
            type="button"
            onClick={() => {
              handleDelete();
              setShowMenu(false);
            }}
            className="flex items-center justify-between w-full px-2.5 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition cursor-pointer mt-0.5 border-t border-slate-800/80 pt-1.5"
          >
            <span>Unsend</span>
            <RotateCcw size={14} className="text-red-400" />
          </button>
        )}
      </div>
    </div>
  );

  const renderQuickActionBar = () => (
    <div className="relative flex items-center gap-0.5 bg-[#111827]/90 border border-slate-700/60 rounded-full px-1 py-0.5 shadow-lg backdrop-blur-xl shrink-0 self-center">
      <button
        type="button"
        onClick={() => {
          setShowMenu((prev) => !prev);
          setShowReactions(false);
        }}
        className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/70 transition cursor-pointer"
        title="More Options"
      >
        <MoreVertical size={13} />
      </button>

      <button
        type="button"
        onClick={handleReply}
        className="p-1 rounded-full text-slate-400 hover:text-cyan-300 hover:bg-slate-700/70 transition cursor-pointer"
        title="Reply"
      >
        <Reply size={13} />
      </button>

      <button
        type="button"
        onClick={() => {
          setShowReactions((prev) => !prev);
          setShowMenu(false);
        }}
        className="p-1 rounded-full text-slate-400 hover:text-amber-300 hover:bg-slate-700/70 transition cursor-pointer"
        title="React"
      >
        <Smile size={13} />
      </button>

      {/* Quick Reaction Bar Popover */}
      {showReactions && (
        <div
          ref={reactionsRef}
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#111827]/95 border border-slate-700/70 rounded-full p-1 shadow-xl z-50 backdrop-blur-2xl animate-in zoom-in-95 duration-150"
        >
          {QUICK_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleAddReaction(emoji)}
              className="text-sm hover:bg-slate-700/70 transition p-1 rounded-full cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Context Menu */}
      {showMenu && renderContextMenu(isMine)}
    </div>
  );

  const renderPinnedBadge = () => (
    <div className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-slate-900/55 border border-slate-700/70 px-2 py-0.5 text-[10px] font-medium text-slate-400">
      <Pin size={10} className="text-amber-300 fill-amber-300 shrink-0" />
      <span>Pinned</span>
    </div>
  );

  const renderReplyPreview = () => {
    if (!msg.replyTo?.id) return null;

    return (
      <button
        type="button"
        onClick={() => {
          const el = document.getElementById(`msg-${msg.replyTo.id}`);
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }}
        className="mb-2 w-full max-w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-950/35 border border-slate-700/45 border-l-cyan-300/60 text-[11px] cursor-pointer hover:bg-slate-900/60 transition"
      >
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-cyan-200">
          <CornerDownRight size={11} className="text-cyan-300 shrink-0" />
          <span className="truncate">@{msg.replyTo.senderName}</span>
        </div>
        <p className="text-slate-400 truncate text-[10px] mt-0.5">
          {msg.replyTo.text}
        </p>
      </button>
    );
  };

  // 1. GEMINI AI ASSISTANT MESSAGE
  if (isAI) {
    return (
      <div
        id={`msg-${msg._id}`}
        className={`flex items-start gap-2.5 my-2.5 select-none justify-start relative group transition-all duration-150 ${
          isDeleting ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
        }`}
      >
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
        <div className="max-w-[78%] bg-[#0f1625] border border-cyan-400/20 px-3.5 py-2.5 rounded-2xl rounded-tl-sm shadow-lg shadow-cyan-950/10 backdrop-blur-xl relative">
          <div className="text-xs sm:text-sm break-words leading-relaxed text-slate-100 font-sans whitespace-pre-wrap">
            {renderMessageWithMentions(msg.message, currentUser?.username)}
          </div>

          {hasCodeSuggestion && (
            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-2.5 py-2">
              <div className="flex min-w-0 items-center gap-2">
                <FileCode2 size={15} className="shrink-0 text-cyan-300" />
                <span className="text-[11px] font-medium text-cyan-100">
                  {isSuggestionApplied ? "Changes applied to editor" : "Code changes are ready to review"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setApplySuggestionError("");
                  if (typeof setActiveSuggestion === "function") {
                    setActiveSuggestion({
                      suggestion: codeSuggestionObj,
                      onApply: handleApplySuggestion,
                    });
                  }
                }}
                className="shrink-0 rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-2.5 py-1 text-[10px] font-semibold text-cyan-100 transition hover:bg-cyan-300/20 cursor-pointer shadow-sm"
              >
                {isSuggestionApplied ? "Review" : "Review & Apply"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. MY MESSAGE (LOGGED IN USER)
  if (isMine) {
    return (
      <div
        id={`msg-${msg._id}`}
        className={`group relative flex items-start justify-end gap-2 my-2 select-none transition-all duration-150 ${
          isDeleting ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
        }`}
      >
        {/* Quick Action Bar (shown on hover) */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {renderQuickActionBar()}
        </div>

        {/* Message Bubble */}
        <div className="max-w-[78%] px-3.5 py-2.5 rounded-2xl shadow-md bg-[#1b2436] text-slate-100 border border-indigo-400/25 rounded-tr-sm relative">
          {isPinned && renderPinnedBadge()}
          {renderReplyPreview()}

          {isAudioMessage ? (
            <VoiceMessagePlayer audioUrl={msg.audioUrl} duration={msg.audioDuration} />
          ) : (
            <div className="text-xs sm:text-sm break-words leading-relaxed whitespace-pre-wrap">
              {renderMessageWithMentions(msg.message, currentUser?.username)}
            </div>
          )}

          {/* Translation Note */}
          {isTranslated && (
            <div className="mt-1 pt-1 border-t border-indigo-500/20 text-[11px] text-cyan-300 italic font-sans">
              Translated: {msg.message}
            </div>
          )}

          {/* Reactions Row */}
          {groupedReactions.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 mt-1.5 pt-0.5">
              {groupedReactions.map(({ emoji, count, hasMine, users }) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleAddReaction(emoji)}
                  title={users.join(", ")}
                  className={`px-1.5 py-0.5 text-[11px] rounded-full border transition flex items-center gap-1 cursor-pointer active:scale-95 ${
                    hasMine
                      ? "bg-blue-500/15 border-blue-400/35 text-blue-200 font-semibold"
                      : "bg-slate-950/45 border-slate-700/60 text-slate-300 hover:bg-slate-800/70"
                  }`}
                >
                  <span>{emoji}</span>
                  {count > 1 && <span className="text-[10px] font-bold font-mono">{count}</span>}
                </button>
              ))}
            </div>
          )}

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
    <div
      id={`msg-${msg._id}`}
      className={`group relative flex items-start justify-start gap-2 my-2 select-none transition-all duration-150 ${
        isDeleting ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
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
            ? "bg-[#141a29] text-slate-100 border border-amber-300/25 rounded-tl-sm shadow-amber-950/10"
            : "bg-[#111726] text-slate-100 border border-slate-800/90 rounded-tl-sm"
        }`}
      >
        {isPinned && renderPinnedBadge()}
        {renderReplyPreview()}

        {isAudioMessage ? (
          <VoiceMessagePlayer audioUrl={msg.audioUrl} duration={msg.audioDuration} />
        ) : (
          <div className="text-xs sm:text-sm break-words leading-relaxed whitespace-pre-wrap">
            {renderMessageWithMentions(msg.message, currentUser?.username)}
          </div>
        )}

        {/* Translation Note */}
        {isTranslated && (
          <div className="mt-1 pt-1 border-t border-slate-800/60 text-[11px] text-cyan-300 italic font-sans">
            Translated: {msg.message}
          </div>
        )}

        {/* Reactions Row */}
        {groupedReactions.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 mt-1.5 pt-0.5">
            {groupedReactions.map(({ emoji, count, hasMine, users }) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleAddReaction(emoji)}
                title={users.join(", ")}
                className={`px-1.5 py-0.5 text-[11px] rounded-full border transition flex items-center gap-1 cursor-pointer active:scale-95 ${
                  hasMine
                    ? "bg-blue-500/15 border-blue-400/35 text-blue-200 font-semibold"
                    : "bg-slate-950/45 border-slate-700/60 text-slate-300 hover:bg-slate-800/70"
                }`}
              >
                <span>{emoji}</span>
                {count > 1 && <span className="text-[10px] font-bold font-mono">{count}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Action Bar (shown on hover) */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {renderQuickActionBar()}
      </div>
    </div>
  );
};

export default memo(ChatMessageBubble);
