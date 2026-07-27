import { memo, useMemo, useState, useCallback } from "react";
import { Bot, Sparkles, MessageSquareCode, AtSign, ChevronDown } from "lucide-react";
import ChatMessageBubble from "./ChatMessageBubble";
import { useUser } from "../../../contexts/user.context";
import { useMessages } from "../../../contexts/Messages.context";

const ChatMessages = ({ chatEndRef }) => {
  const { user: currentUser } = useUser();
  const { messages } = useMessages();

  const currentUserId = currentUser?._id;

  const renderedMessages = useMemo(() => {
    return messages.map((msg) => ({
      ...msg,
      isMine: String(msg.senderId || "") === String(currentUserId || ""),
    }));
  }, [messages, currentUserId]);

  // Calculate messages mentioning the logged in user
  const mentionedMessages = useMemo(() => {
    if (!currentUser?.username) return [];
    const regex = new RegExp(`@${currentUser.username}\\b`, "i");
    return messages.filter(
      (m) =>
        String(m.senderId || "") !== String(currentUserId || "") &&
        regex.test(m.message || "")
    );
  }, [messages, currentUser?.username, currentUserId]);

  const [activeMentionIndex, setActiveMentionIndex] = useState(0);

  const handleScrollToMention = useCallback(() => {
    if (mentionedMessages.length === 0) return;
    const targetMsg = mentionedMessages[activeMentionIndex];
    if (targetMsg) {
      const targetId = targetMsg._id;
      if (targetId) {
        const el = document.getElementById(`msg-${targetId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
    setActiveMentionIndex((prev) => (prev + 1) % mentionedMessages.length);
  }, [mentionedMessages, activeMentionIndex]);

  return (
    <section className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 hide-scrollbar bg-[#080b11]/90 select-none relative">
      {/* Sticky Mention Counter & Quick Scroll Pill */}
      {mentionedMessages.length > 0 && (
        <div className="sticky top-0 z-20 flex justify-center py-1 select-none">
          <button
            type="button"
            onClick={handleScrollToMention}
            title="Click to scroll to next mention"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141b2b]/95 border border-amber-500/40 text-amber-300 hover:bg-[#192237] hover:border-amber-500/60 transition cursor-pointer text-[11px] font-mono shadow-xl shadow-black/40 backdrop-blur-2xl"
          >
            <AtSign size={12} className="text-amber-400" />
            <span>
              Mention {((activeMentionIndex - 1 + mentionedMessages.length) % mentionedMessages.length) + 1} of {mentionedMessages.length}
            </span>
            <ChevronDown size={12} className="text-amber-400 ml-0.5" />
          </button>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center text-slate-400 select-none my-auto">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 shadow-lg shadow-purple-500/10 animate-pulse">
            <Bot size={28} />
          </div>

          <h4 className="text-base font-extrabold text-white mb-1.5 tracking-tight">
            Workspace AI Assistant
          </h4>

          <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-6">
            Chat in real-time with teammates or type <code className="bg-slate-800 text-purple-300 px-1.5 py-0.5 rounded border border-slate-700 font-mono text-[11px]">@ai</code> to ask Gemini to write code or answer questions.
          </p>

          {/* Prompt Suggestion Cards */}
          <div className="flex flex-col gap-2 w-full max-w-xs text-left">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
              <Sparkles size={14} className="text-purple-400 shrink-0" />
              <span><code className="text-purple-300 font-mono">@ai</code> create an express server app.js</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
              <MessageSquareCode size={14} className="text-blue-400 shrink-0" />
              <span><code className="text-blue-300 font-mono">@username</code> can you review this file?</span>
            </div>
          </div>
        </div>
      ) : (
        renderedMessages.map((msg, index) => (
          <ChatMessageBubble
            key={msg._id || index}
            msg={msg}
            isMine={msg.isMine}
          />
        ))
      )}
      <div ref={chatEndRef} />
    </section>
  );
};

export default memo(ChatMessages);