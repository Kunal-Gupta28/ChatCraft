import { useState, useCallback, useRef, useEffect, memo } from "react";
import { SendHorizonal, Sparkles, Loader2, Smile, Check, Mic } from "lucide-react";
import { useChat } from "../../../../contexts/chat.context";
import { useProject } from "../../../../contexts/project.context";
import { useUser } from "../../../../contexts/user.context";

import EmojiPickerPopover from "./EmojiPickerPopover";
import MentionsDropdown from "./MentionsDropdown";
import VoiceRecorderBar from "./VoiceRecorderBar";
import ReplyEditBanner from "./ReplyEditBanner";
import { useVoiceRecorder } from "./useVoiceRecorder";
import { useMentions } from "./useMentions";

const ChatInput = () => {
  const {
    inputMessage: rawInputMessage, setInputMessage, handleSend, handleSendVoiceMessage,
    editingMessage, cancelEditMessage, replyToMessage, cancelReplyMessage,
    handleSaveEdit, isSending, sendError,
  } = useChat();

  const { project } = useProject();
  const { user: currentUser } = useUser();
  const inputMessage = typeof rawInputMessage === "string" ? rawInputMessage : "";

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);
  const popoverRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const {
    isRecording, recordingSeconds, audioError, startRecording, cancelRecording, completeRecording,
  } = useVoiceRecorder(handleSendVoiceMessage);

  const {
    showMentions, setShowMentions, selectedIndex, setSelectedIndex,
    filteredMentions, handleInputChange, selectMention, stopTyping
  } = useMentions({ project, currentUser, inputMessage, setInputMessage, isTypingRef, typingTimeoutRef });

  const isDisabled = !String(inputMessage ?? "").trim() || isSending;
  const isAITrigger = inputMessage.includes("@ai");

  useEffect(() => {
    if (editingMessage && inputRef.current) {
      inputRef.current.focus();
      requestAnimationFrame(() => { inputRef.current?.select(); });
    }
  }, [editingMessage]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
        setShowMentions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowMentions]);

  const handleKeyDown = useCallback((e) => {
    if (showMentions && filteredMentions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredMentions.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredMentions.length) % filteredMentions.length);
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        selectMention(filteredMentions[selectedIndex] || filteredMentions[0]);
        return;
      }
      if (e.key === "Escape") {
        setShowMentions(false);
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (editingMessage) {
        stopTyping();
        handleSaveEdit();
      } else if (!isDisabled) {
        stopTyping();
        handleSend();
      }
    }
  }, [editingMessage, filteredMentions, handleSaveEdit, handleSend, isDisabled, selectMention, selectedIndex, setSelectedIndex, setShowMentions, showMentions, stopTyping]);

  const handleSendClick = useCallback(() => {
    stopTyping();
    if (editingMessage) handleSaveEdit();
    else if (!isDisabled) handleSend();
  }, [editingMessage, handleSaveEdit, handleSend, isDisabled, stopTyping]);

  const handleEmojiSelect = useCallback((emoji) => {
    setInputMessage(`${inputMessage}${emoji}`);
  }, [inputMessage, setInputMessage]);

  return (
    <div ref={popoverRef} className="relative bg-[#06080e] border-t border-slate-800/80 p-2 select-none font-sans">
      <EmojiPickerPopover isOpen={showEmojiPicker} onClose={() => setShowEmojiPicker(false)} onSelectEmoji={handleEmojiSelect} />
      <MentionsDropdown isOpen={showMentions} mentions={filteredMentions} selectedIndex={selectedIndex} onSelectMention={selectMention} />

      {isRecording ? (
        <VoiceRecorderBar
          isRecording={isRecording}
          recordingSeconds={recordingSeconds}
          onStopAndSendUser={() => completeRecording(false)}
          onStopAndSendAI={() => completeRecording(true)}
          onCancel={cancelRecording}
        />
      ) : (
        <div className="space-y-2">
          <ReplyEditBanner
            editingMessage={editingMessage}
            cancelEditMessage={cancelEditMessage}
            replyToMessage={replyToMessage}
            cancelReplyMessage={cancelReplyMessage}
          />
          <div className="relative flex items-center bg-[#0d121f] border border-slate-800 focus-within:border-cyan-500/50 rounded-2xl p-1.5 transition shadow-inner">
            <button
              type="button"
              onClick={() => { setShowEmojiPicker((prev) => !prev); setShowMentions(false); }}
              className="p-2 text-slate-400 hover:text-cyan-300 rounded-xl hover:bg-slate-800/60 transition cursor-pointer shrink-0"
              title="Add Emoji"
            >
              <Smile size={17} />
            </button>
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={editingMessage ? "Edit your message..." : "Type a message or @ai for assistance..."}
              rows={1}
              className="flex-1 bg-transparent border-0 px-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-0 resize-none max-h-24 font-sans leading-relaxed"
            />
            <div className="flex items-center gap-1 shrink-0 ml-1">
              {!inputMessage.trim() && (
                <button
                  type="button"
                  onClick={startRecording}
                  className="p-2 text-slate-400 hover:text-cyan-300 rounded-xl hover:bg-slate-800/60 transition cursor-pointer"
                  title="Record Voice Note"
                >
                  <Mic size={16} />
                </button>
              )}
              {editingMessage ? (
                <button
                  type="button"
                  onClick={handleSendClick}
                  disabled={!inputMessage.trim()}
                  className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 disabled:opacity-40 transition shadow-md cursor-pointer"
                  title="Save Edit"
                >
                  <Check size={15} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSendClick}
                  disabled={isDisabled}
                  className={`p-2 rounded-xl transition shadow-md cursor-pointer ${
                    isAITrigger
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-500/20"
                      : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                  } disabled:opacity-40 disabled:cursor-not-allowed active:scale-95`}
                  title="Send Message"
                >
                  {isSending ? <Loader2 size={15} className="animate-spin" /> : isAITrigger ? <Sparkles size={15} /> : <SendHorizonal size={15} />}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {sendError && (
        <div className="mt-1 text-[10px] font-mono text-red-400 px-1 truncate" title={sendError}>
          {sendError.includes("http") || sendError.includes("GoogleGenerativeAI")
            ? "⚠️ AI service is busy or quota limited. Please try again shortly."
            : sendError}
        </div>
      )}
      {audioError && <div className="mt-1 text-[10px] font-mono text-red-400 px-1">{audioError}</div>}
    </div>
  );
};

export default memo(ChatInput);
