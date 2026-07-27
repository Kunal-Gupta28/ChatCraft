import { useState, useCallback, useRef, useEffect, memo } from "react";
import { SendHorizonal, Sparkles, Loader2, Smile, Bot, X, Pencil, Check } from "lucide-react";
import { useChat } from "../../../contexts/chat.context";
import { useProject } from "../../../contexts/project.context";
import { useUser } from "../../../contexts/user.context";

const POPULAR_EMOJIS = [
  "🔥", "🚀", "💡", "👍", "❤️", "🎉", "🐛", "✨",
  "💻", "✅", "🤖", "⚡", "👀", "🙌", "💯", "🛠️",
  "⭐", "📦", "🎨", "🔒", "💬", "🎯", "🧠", "👋"
];

const ChatInput = ({ handleKeyPress }) => {
  const {
    inputMessage: rawInputMessage,
    setInputMessage,
    handleSend,
    editingMessage,
    cancelEditMessage,
    handleSaveEdit,
    isSending,
    sendError,
  } = useChat();

  const { project } = useProject();
  const { user: currentUser } = useUser();

  const inputMessage = typeof rawInputMessage === "string" ? rawInputMessage : "";

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef(null);
  const popoverRef = useRef(null);

  const isDisabled = !inputMessage.trim() || isSending;
  const isAITrigger = inputMessage.includes("@ai");

  // Focus input when editing starts
  useEffect(() => {
    if (editingMessage) {
      inputRef.current?.focus();
    }
  }, [editingMessage]);

  // Collaborators for mention list (excluding the logged-in user themselves)
  const mentionCandidates = [
    { username: "ai", name: "Gemini AI Companion", isAI: true },
    ...(project?.users
      ?.filter(
        (u) =>
          String(u._id || "") !== String(currentUser?._id || "") &&
          u.username !== currentUser?.username
      )
      ?.map((u) => ({
        username: u.username,
        name: u.username,
        isAI: false,
        profilePic: u.profilePic,
      })) || []),
  ];

  // Filter mention candidates based on query after @
  const filteredMentions = mentionCandidates.filter((item) =>
    item.username.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [mentionQuery, showMentions]);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
        setShowMentions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = useCallback((e) => {
    const val = e.target.value;
    setInputMessage(val);

    // Detect @ for mention triggering
    const lastAtIndex = val.lastIndexOf("@");
    if (lastAtIndex !== -1) {
      const query = val.slice(lastAtIndex + 1);
      // Only show if query doesn't contain spaces
      if (!query.includes(" ")) {
        setMentionQuery(query);
        setShowMentions(true);
        return;
      }
    }
    setShowMentions(false);
  }, [setInputMessage]);

  const insertEmoji = useCallback((emoji) => {
    setInputMessage((prev) => (typeof prev === "string" ? prev : "") + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  }, [setInputMessage]);

  const selectMention = useCallback((username) => {
    setInputMessage((prev) => {
      const str = typeof prev === "string" ? prev : "";
      const lastAtIndex = str.lastIndexOf("@");
      if (lastAtIndex !== -1) {
        return str.slice(0, lastAtIndex) + `@${username} `;
      }
      return str + `@${username} `;
    });
    setShowMentions(false);
    inputRef.current?.focus();
  }, [setInputMessage]);

  // Keyboard navigation for @mention popover and Esc to cancel edit
  const onInputKeyDown = useCallback(
    (e) => {
      if (showMentions && filteredMentions.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filteredMentions.length);
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex(
            (prev) => (prev - 1 + filteredMentions.length) % filteredMentions.length
          );
          return;
        }
        if (e.key === "Enter" || e.key === "Tab") {
          e.preventDefault();
          const targetItem = filteredMentions[selectedIndex] || filteredMentions[0];
          if (targetItem) {
            selectMention(targetItem.username);
          }
          return;
        }
      }

      if (e.key === "Escape") {
        e.preventDefault();
        if (showMentions) {
          setShowMentions(false);
        } else if (editingMessage) {
          cancelEditMessage();
        }
        return;
      }

      handleKeyPress(e);
    },
    [showMentions, filteredMentions, selectedIndex, selectMention, handleKeyPress, editingMessage, cancelEditMessage]
  );

  return (
    <footer className="flex flex-col gap-2 p-3.5 border-t border-slate-800/80 bg-[#090d16]/95 backdrop-blur-2xl relative select-none shrink-0" ref={popoverRef}>
      {/* Error Alert */}
      {sendError && (
        <p className="text-xs text-red-400 font-medium px-2">{sendError}</p>
      )}

      {/* Editing Message Mode Indicator */}
      {editingMessage && (
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold shadow-md">
          <div className="flex items-center gap-2 truncate">
            <Pencil size={13} className="text-blue-400 shrink-0" />
            <span className="truncate">
              Editing message • <span className="text-[10px] text-slate-400 font-mono">Press Esc to cancel</span>
            </span>
          </div>
          <button
            type="button"
            onClick={cancelEditMessage}
            className="p-1 text-slate-400 hover:text-white transition cursor-pointer shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* AI Indicator Badge */}
      {!editingMessage && isAITrigger && (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold w-fit shadow-md">
          <Sparkles size={13} className="animate-spin text-purple-400" />
          <span>Prompting Gemini AI Assistant</span>
        </div>
      )}

      {/* Mention Auto-Complete Popover */}
      {showMentions && filteredMentions.length > 0 && (
        <div className="absolute bottom-16 left-3.5 z-50 bg-[#090d16]/98 border border-slate-800/90 shadow-2xl rounded-xl p-1 min-w-[210px] max-h-52 overflow-y-auto backdrop-blur-2xl">
          <div className="px-2 py-1 text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">
            Mentions
          </div>
          {filteredMentions.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={item.username}
                type="button"
                onClick={() => selectMention(item.username)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex items-center justify-between gap-2.5 w-full px-2 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
                  isSelected
                    ? "bg-blue-600/20 text-blue-300 font-semibold"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {item.isAI ? (
                    <div className="w-5 h-5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                      <Bot size={12} />
                    </div>
                  ) : item.profilePic ? (
                    <img
                      src={item.profilePic}
                      alt={item.username}
                      className="w-5 h-5 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                      {item.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="truncate">@{item.username}</span>
                </div>

                <span className="text-[10px] text-slate-500 font-mono shrink-0">
                  {item.isAI ? "AI" : "User"}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 right-12 z-50 bg-[#0d121f] border border-slate-800 shadow-2xl rounded-2xl p-3 w-64 backdrop-blur-2xl">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800/80">
            <span className="text-xs font-bold text-slate-300">Select Emoji</span>
            <button
              onClick={() => setShowEmojiPicker(false)}
              className="text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto p-1">
            {POPULAR_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => insertEmoji(emoji)}
                className="text-lg hover:bg-slate-800/80 p-1.5 rounded-xl transition hover:scale-110 active:scale-95 cursor-pointer text-center"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-center gap-2 w-full relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={
            editingMessage
              ? "Edit your message..."
              : "Type a message, @mention collaborator, or @ai to prompt..."
          }
          value={inputMessage}
          onChange={handleChange}
          onKeyDown={onInputKeyDown}
          className="flex-1 pl-4 pr-10 py-2.5 text-xs sm:text-sm bg-slate-950/90 border border-slate-800 
                     rounded-xl text-slate-100 placeholder-slate-500 
                     focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition"
        />

        {/* Emoji Button */}
        <button
          type="button"
          aria-label="Insert Emoji"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="absolute right-14 text-slate-400 hover:text-yellow-400 transition cursor-pointer"
        >
          <Smile size={18} />
        </button>

        {/* Send / Save Button */}
        <button
          type="button"
          onClick={editingMessage ? handleSaveEdit : handleSend}
          disabled={isDisabled}
          aria-label={editingMessage ? "Save edit" : "Send message"}
          className={`
            p-2.5 rounded-xl text-white transition-all duration-200 shrink-0 flex items-center justify-center
            ${
              isDisabled
                ? "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50"
                : editingMessage
                ? "bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
                : isAITrigger
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/20 active:scale-95 cursor-pointer"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
            }
          `}
        >
          {isSending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : editingMessage ? (
            <Check size={18} />
          ) : (
            <SendHorizonal size={18} />
          )}
        </button>
      </div>
    </footer>
  );
};

export default memo(ChatInput);
