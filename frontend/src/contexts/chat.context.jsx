/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectInputMessage, selectIsSending, selectSendError,
  setInputMessage as setInputMessageAction, setIsSending as setIsSendingAction, setSendError as setSendErrorAction,
} from "../store/slices/chatSlice";
import { sendMessage, receiveMessage } from "../config/socket";
import { useChatActions } from "./useChatActions";

const ChatContext = createContext(null);

const AI_THINKING_TIMEOUT_MS = 30000; // 30s hard cap

export const ChatProvider = ({ children }) => {
  const rawInputMessage = useSelector(selectInputMessage);
  const inputMessage = typeof rawInputMessage === "string" ? rawInputMessage : "";
  const isSending = useSelector(selectIsSending);
  const sendError = useSelector(selectSendError);
  const dispatch = useDispatch();

  useEffect(() => {
    if (sendError) {
      const timer = setTimeout(() => {
        dispatch(setSendErrorAction(null));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [sendError, dispatch]);

  const [typingUsers, setTypingUsers] = useState([]);
  const [isAiThinking, setIsAiThinkingState] = useState(false);
  const [aiThinkingUser, setAiThinkingUser] = useState(null);
  const aiThinkingTimerRef = useRef(null);

  const {
    editingMessage, replyToMessage, setReplyToMessage, startEditMessage, cancelEditMessage,
    startReplyMessage, cancelReplyMessage, handleSaveEdit, handleDelete, handleTogglePin,
    handleToggleReaction
  } = useChatActions({ inputMessage });

  // Alias functions to support legacy component call prop names
  const handleDeleteMessage = handleDelete;
  const handleTogglePinMessage = handleTogglePin;

  // Listen for server-emitted AI thinking events
  useEffect(() => {
    const cleanup = receiveMessage("project-ai-thinking", (data) => {
      if (data?.isThinking) {
        setIsAiThinkingState(true);
        setAiThinkingUser({ username: data.username || "Gemini AI", userId: data.userId });
        if (aiThinkingTimerRef.current) clearTimeout(aiThinkingTimerRef.current);
        aiThinkingTimerRef.current = setTimeout(() => {
          setIsAiThinkingState(false);
          setAiThinkingUser(null);
        }, AI_THINKING_TIMEOUT_MS);
      } else {
        setIsAiThinkingState(false);
        setAiThinkingUser(null);
        if (aiThinkingTimerRef.current) {
          clearTimeout(aiThinkingTimerRef.current);
          aiThinkingTimerRef.current = null;
        }
      }
    });
    return () => {
      if (typeof cleanup === "function") cleanup();
    };
  }, []);

  const messages = useSelector((state) => state.chat.messages || []);
  const prevMsgLengthRef = useRef(messages.length);

  const clearAiThinking = useCallback(() => {
    setIsAiThinkingState(false);
    setAiThinkingUser(null);
    if (aiThinkingTimerRef.current) {
      clearTimeout(aiThinkingTimerRef.current);
      aiThinkingTimerRef.current = null;
    }
  }, []);

  // Auto-clear AI indicator when AI message arrives
  useEffect(() => {
    if (messages.length > prevMsgLengthRef.current) {
      prevMsgLengthRef.current = messages.length;
      const lastMsg = messages[messages.length - 1];
      const isAiMsg = lastMsg?.type === "ai" || lastMsg?.senderName?.includes("AI") || lastMsg?.senderName?.includes("Gemini");
      if (isAiMsg) {
        clearAiThinking();
      }
    }
  }, [messages, clearAiThinking]);

  const setIsAiThinking = useCallback((val) => {
    if (val) {
      setIsAiThinkingState(true);
      if (aiThinkingTimerRef.current) clearTimeout(aiThinkingTimerRef.current);
      aiThinkingTimerRef.current = setTimeout(() => {
        setIsAiThinkingState(false);
        setAiThinkingUser(null);
      }, AI_THINKING_TIMEOUT_MS);
    } else {
      clearAiThinking();
    }
  }, [clearAiThinking]);

  const setInputMessage = useCallback(
    (val) => {
      dispatch(setInputMessageAction(val));
    },
    [dispatch]
  );

  const updateTypingUser = useCallback(({ userId, username, isTyping }) => {
    if (!userId) return;
    setTypingUsers((current) => {
      const withoutUser = current.filter((u) => String(u.userId) !== String(userId));
      return isTyping ? [...withoutUser, { userId, username: username || "A collaborator" }] : withoutUser;
    });
  }, []);

  const clearTypingUsers = useCallback(() => {
    setTypingUsers([]);
  }, []);

  const handleSend = useCallback(async () => {
    if (editingMessage) {
      await handleSaveEdit();
      return;
    }

    const message = inputMessage.trim();
    if (!message || isSending) return;

    const activeReply = replyToMessage;

    dispatch(setInputMessageAction(""));
    dispatch(setSendErrorAction(""));
    dispatch(setIsSendingAction(true));
    setReplyToMessage(null);

    const isAiTargeted = message.toLowerCase().includes("@ai");
    if (isAiTargeted) {
      setIsAiThinking(true);
    }

    try {
      await sendMessage("project-message", {
        message,
        replyTo: activeReply?.id ? activeReply : undefined,
      });
    } catch (err) {
      dispatch(setSendErrorAction(err?.message || "Failed to send message"));
      dispatch(setInputMessageAction(message));
      clearAiThinking();
    } finally {
      dispatch(setIsSendingAction(false));
    }
  }, [dispatch, editingMessage, handleSaveEdit, inputMessage, isSending, replyToMessage, setInputMessageAction, setReplyToMessage, setIsAiThinking, clearAiThinking]);

  // Voice message handler — sends audio data URL via socket
  const handleSendVoiceMessage = useCallback(async ({ audioUrl, audioDuration, sendToAI = false }) => {
    if (!audioUrl) return;

    dispatch(setIsSendingAction(true));
    try {
      const messageText = sendToAI ? "@ai [Voice Note]" : "[Voice Note]";
      if (sendToAI) setIsAiThinking(true);
      await sendMessage("project-message", {
        message: messageText,
        audioUrl,
        audioDuration,
      });
    } catch (err) {
      dispatch(setSendErrorAction(err?.message || "Failed to send voice note"));
      clearAiThinking();
    } finally {
      dispatch(setIsSendingAction(false));
    }
  }, [dispatch, setIsAiThinking, clearAiThinking]);

  const contextValue = useMemo(
    () => ({
      inputMessage, setInputMessage, isSending, sendError, typingUsers,
      updateTypingUser, clearTypingUsers, isAiThinking, aiThinkingUser,
      setIsAiThinking, handleSend, handleSendVoiceMessage, editingMessage, startEditMessage,
      cancelEditMessage, replyToMessage, startReplyMessage, cancelReplyMessage,
      handleDelete, handleDeleteMessage, handleTogglePin, handleTogglePinMessage, handleToggleReaction
    }),
    [
      inputMessage, setInputMessage, isSending, sendError, typingUsers,
      updateTypingUser, clearTypingUsers, isAiThinking, aiThinkingUser,
      setIsAiThinking, handleSend, handleSendVoiceMessage, editingMessage, startEditMessage,
      cancelEditMessage, replyToMessage, startReplyMessage, cancelReplyMessage,
      handleDelete, handleDeleteMessage, handleTogglePin, handleTogglePinMessage, handleToggleReaction
    ]
  );

  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
