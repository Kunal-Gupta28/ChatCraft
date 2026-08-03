import { useState, useCallback, useRef, useEffect, memo } from "react";
import { SendHorizonal, Sparkles, Loader2, Smile, Bot, X, Pencil, Check, CornerDownRight, Mic, Square } from "lucide-react";
import { useChat } from "../../../contexts/chat.context";
import { useProject } from "../../../contexts/project.context";
import { useUser } from "../../../contexts/user.context";
import { emitSocketEvent } from "../../../config/socket";

const POPULAR_EMOJIS = [
  "🔥", "🚀", "💡", "👍", "❤️", "🎉", "✨", "✅",
  "💻", "🤖", "⚡", "👀", "🙌", "💯", "🛠️", "⭐",
  "📦", "🎨", "🔒", "💬", "🎯", "🧠", "👋"
];

const MAX_RECORDING_SECONDS = 10;

const toDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not prepare the voice note"));
    reader.readAsDataURL(blob);
  });

const formatRecordingTime = (seconds) =>
  `0:${String(Math.min(seconds, MAX_RECORDING_SECONDS)).padStart(2, "0")}`;

const ChatInput = ({ handleKeyPress }) => {
  const {
    inputMessage: rawInputMessage,
    setInputMessage,
    handleSend,
    handleSendVoiceMessage,
    editingMessage,
    cancelEditMessage,
    replyToMessage,
    cancelReplyMessage,
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
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioError, setAudioError] = useState("");

  const inputRef = useRef(null);
  const popoverRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const autoStopTimerRef = useRef(null);
  const recordingStartedAtRef = useRef(0);
  const shouldSendVoiceRef = useRef(true);

  const isDisabled = !String(inputMessage ?? "").trim() || isSending;
  const isAITrigger = inputMessage.includes("@ai");

  // Focus and auto-select text in input when editing starts
  useEffect(() => {
    if (editingMessage && inputRef.current) {
      inputRef.current.focus();
      requestAnimationFrame(() => {
        inputRef.current?.select();
      });
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
    item.username && item.username.toLowerCase().includes(mentionQuery.toLowerCase())
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

  const emitTypingState = useCallback((isTyping) => {
    if (isTypingRef.current === isTyping) return;
    emitSocketEvent("project-typing", { isTyping });
    isTypingRef.current = isTyping;
  }, []);

  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    emitTypingState(false);
  }, [emitTypingState]);

  const startTyping = useCallback(() => {
    emitTypingState(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(stopTyping, 1200);
  }, [emitTypingState, stopTyping]);

  useEffect(() => () => stopTyping(), [stopTyping]);

  const clearRecordingTimers = useCallback(() => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (autoStopTimerRef.current) {
      clearTimeout(autoStopTimerRef.current);
      autoStopTimerRef.current = null;
    }
  }, []);

  const releaseMicrophone = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
  }, []);

  const completeRecording = useCallback(async (sendToAI = false) => {
    clearRecordingTimers();
    releaseMicrophone();
    setIsRecording(false);

    const chunks = audioChunksRef.current;
    audioChunksRef.current = [];
    if (!shouldSendVoiceRef.current || chunks.length === 0) return;

    const recording = new Blob(chunks, {
      type: mediaRecorderRef.current?.mimeType || "audio/webm",
    });
    if (recording.size === 0) {
      setAudioError("No audio was captured. Please try again.");
      return;
    }
    if (recording.size > 650 * 1024) {
      setAudioError("Voice note is too large. Please keep it shorter.");
      return;
    }

    try {
      const audioUrl = await toDataUrl(recording);
      const duration = Math.max(
        1,
        Math.min(
          MAX_RECORDING_SECONDS,
          Math.round((Date.now() - recordingStartedAtRef.current) / 1000),
        ),
      );
      await handleSendVoiceMessage({ audioUrl, duration, sendToAI });
    } catch (error) {
      setAudioError(error.message || "Voice note could not be sent.");
    }
  }, [clearRecordingTimers, handleSendVoiceMessage, releaseMicrophone]);

  const stopRecording = useCallback(() => {
    clearRecordingTimers();
    const recorder = mediaRecorderRef.current;
    if (recorder?.state === "recording") {
      recorder.stop();
      return;
    }
    releaseMicrophone();
    setIsRecording(false);
  }, [clearRecordingTimers, releaseMicrophone]);

  const startRecording = useCallback(async () => {
    if (isSending || editingMessage || isRecording) return;
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setAudioError("Voice notes are not supported in this browser.");
      return;
    }

    stopTyping();
    setAudioError("");
    shouldSendVoiceRef.current = true;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = ["audio/webm;codecs=opus", "audio/ogg;codecs=opus", "audio/mp4"]
        .find((type) => MediaRecorder.isTypeSupported(type));
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recordingStartedAtRef.current = Date.now();
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      const sendToAI = isAITrigger;
      recorder.onstop = () => {
        void completeRecording(sendToAI);
      };
      recorder.start();
      setRecordingSeconds(0);
      setIsRecording(true);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((seconds) => Math.min(seconds + 1, MAX_RECORDING_SECONDS));
      }, 1000);
      autoStopTimerRef.current = setTimeout(stopRecording, MAX_RECORDING_SECONDS * 1000);
    } catch {
      releaseMicrophone();
      setAudioError("Microphone permission is needed to record a voice note.");
    }
  }, [completeRecording, editingMessage, isAITrigger, isRecording, isSending, releaseMicrophone, stopRecording, stopTyping]);

  useEffect(() => () => {
    shouldSendVoiceRef.current = false;
    clearRecordingTimers();
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    releaseMicrophone();
  }, [clearRecordingTimers, releaseMicrophone]);

  const handleChange = useCallback((e) => {
    const val = e.target.value;
    setInputMessage(val);

    if (val.trim()) startTyping();
    else stopTyping();

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
  }, [setInputMessage, startTyping, stopTyping]);

  const insertEmoji = useCallback((emoji) => {
    setInputMessage((prev) => (typeof prev === "string" ? prev : "") + emoji);
    startTyping();
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  }, [setInputMessage, startTyping]);

  const selectMention = useCallback((username) => {
    setInputMessage((prev) => {
      const str = typeof prev === "string" ? prev : "";
      const lastAtIndex = str.lastIndexOf("@");
      if (lastAtIndex !== -1) {
        return str.slice(0, lastAtIndex) + `@${username} `;
      }
      return str + `@${username} `;
    });
    startTyping();
    setShowMentions(false);
    inputRef.current?.focus();
  }, [setInputMessage, startTyping]);

  const submitMessage = useCallback(() => {
    stopTyping();
    if (editingMessage) {
      handleSaveEdit();
      return;
    }
    handleSend();
  }, [editingMessage, handleSaveEdit, handleSend, stopTyping]);

  // Keyboard navigation for @mention popover and Esc/Enter handlers
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
          stopTyping();
          cancelEditMessage();
        }
        return;
      }

      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submitMessage();
        return;
      }

      handleKeyPress?.(e);
    },
    [showMentions, filteredMentions, selectedIndex, selectMention, handleKeyPress, editingMessage, cancelEditMessage, submitMessage, stopTyping]
  );

  return (
    <footer className="flex flex-col gap-2 p-3.5 border-t border-slate-800/80 bg-[#090d16]/95 backdrop-blur-2xl relative select-none shrink-0" ref={popoverRef}>
      {/* Error Alert */}
      {sendError && (
        <p className="text-xs text-red-400 font-medium px-2">{sendError}</p>
      )}
      {audioError && (
        <p className="text-xs text-red-400 font-medium px-2">{audioError}</p>
      )}

      {/* Replying To Message Indicator Banner */}
      {replyToMessage && (
        <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-900/70 border border-slate-700/70 border-l-cyan-300/60 text-xs shadow-sm">
          <div className="flex items-center gap-2 truncate">
            <CornerDownRight size={13} className="text-cyan-300 shrink-0" />
            <div className="min-w-0 truncate">
              <p className="text-[11px] font-semibold text-slate-200 truncate">
                Replying to <span className="text-cyan-200">@{replyToMessage.senderName}</span>
              </p>
              <p className="text-[10px] text-slate-500 truncate">{replyToMessage.text}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={cancelReplyMessage}
            className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Editing Message Mode Indicator */}
      {editingMessage && (
        <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-900/70 border border-slate-700/70 border-l-blue-300/60 text-xs shadow-sm">
          <div className="flex items-center gap-2 truncate">
            <Pencil size={13} className="text-blue-300 shrink-0" />
            <div className="min-w-0 truncate">
              <p className="text-[11px] font-semibold text-slate-200 truncate">Editing message</p>
              <p className="text-[10px] text-slate-500 truncate">Press Esc to cancel</p>
            </div>
          </div>
          <button
            type="button"
            onClick={cancelEditMessage}
            className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* AI Indicator Badge */}
      {!editingMessage && isAITrigger && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-400/10 border border-purple-300/20 text-purple-200 text-[11px] font-medium w-fit">
          <Sparkles size={12} className="text-purple-300" />
          <span>Prompting Gemini AI Assistant</span>
        </div>
      )}

      {isRecording && (
        <div className="flex items-center gap-2 px-2.5 py-1 text-[11px] font-medium text-red-200">
          <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
          {isAITrigger ? "Recording Gemini command" : "Recording"} {formatRecordingTime(recordingSeconds)} / 0:10
          <span className="text-slate-500">Tap the mic to send</span>
        </div>
      )}

      {/* Mention Auto-Complete Popover */}
      {showMentions && filteredMentions.length > 0 && (
        <div className="absolute bottom-16 left-3.5 z-50 bg-[#111827]/95 border border-slate-700/70 shadow-xl rounded-xl p-1 min-w-[220px] max-h-52 overflow-y-auto backdrop-blur-2xl">
          <div className="px-2.5 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
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
                className={`flex items-center justify-between gap-2.5 w-full px-2.5 py-2 rounded-lg text-xs transition cursor-pointer ${
                  isSelected
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {item.isAI ? (
                    <div className="w-6 h-6 rounded-lg bg-purple-400/10 border border-purple-300/20 text-purple-300 flex items-center justify-center shrink-0">
                      <Bot size={12} />
                    </div>
                  ) : item.profilePic ? (
                    <img
                      src={item.profilePic}
                      alt={item.username}
                      className="w-6 h-6 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 font-semibold text-[10px]">
                      {item.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="truncate">@{item.username}</span>
                </div>

                <span className="text-[10px] text-slate-500 shrink-0">
                  {item.isAI ? "AI" : "User"}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 right-12 z-50 bg-[#111827]/95 border border-slate-700/70 shadow-xl rounded-2xl p-3 w-64 backdrop-blur-2xl">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800/80">
            <span className="text-xs font-semibold text-slate-300">Select emoji</span>
            <button
              onClick={() => setShowEmojiPicker(false)}
              className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition cursor-pointer"
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
                className="text-base hover:bg-slate-800/80 p-1.5 rounded-lg transition active:scale-95 cursor-pointer text-center"
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
              : "Message, @mention, or @ai..."
          }
          value={inputMessage}
          onChange={handleChange}
          onKeyDown={onInputKeyDown}
          onBlur={stopTyping}
          className="flex-1 pl-4 pr-28 py-2.5 text-xs sm:text-sm bg-slate-950/90 border border-slate-700/80
                     rounded-xl text-slate-100 placeholder-slate-500
                     focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-700/30 transition"
        />

        {/* Emoji Button */}
        <button
          type="button"
          aria-label="Insert Emoji"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="absolute right-14 text-slate-500 hover:text-slate-200 transition cursor-pointer"
        >
          <Smile size={18} />
        </button>

        <button
          type="button"
          aria-label={isRecording ? "Stop and send voice note" : "Record voice note"}
          title={isRecording ? "Stop and send" : "Record voice note"}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isSending || Boolean(editingMessage)}
          className={`absolute right-[5.25rem] rounded-md p-1 transition ${
            isRecording
              ? "bg-red-500/15 text-red-300 hover:bg-red-500/25"
              : "text-slate-500 hover:text-cyan-200"
          } ${isSending || editingMessage ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
        >
          {isRecording ? <Square size={15} fill="currentColor" /> : <Mic size={17} />}
        </button>

        {/* Send / Save Button */}
        <button
          type="button"
          onClick={submitMessage}
          disabled={isDisabled}
          aria-label={editingMessage ? "Save edit" : "Send message"}
          className={`
            p-2.5 rounded-xl text-white transition-all duration-200 shrink-0 flex items-center justify-center
            ${
              isDisabled
                ? "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50"
              : editingMessage
                ? "bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/15 active:scale-95 cursor-pointer"
              : isAITrigger
                ? "bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-500/15 active:scale-95 cursor-pointer"
                : "bg-slate-700 hover:bg-slate-600 shadow-lg shadow-black/20 active:scale-95 cursor-pointer"
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
