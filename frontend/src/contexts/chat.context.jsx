/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectInputMessage,
  selectIsSending,
  selectSendError,
  setInputMessage as setInputMessageAction,
  setIsSending as setIsSendingAction,
  setSendError as setSendErrorAction,
  updateMessage as updateMessageAction,
  deleteMessage as deleteMessageAction,
  togglePinMessage as togglePinMessageAction,
} from "../store/slices/chatSlice";
import { selectUser } from "../store/slices/userSlice";
import { sendMessage } from "../config/socket";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const rawInputMessage = useSelector(selectInputMessage);
  const inputMessage = typeof rawInputMessage === "string" ? rawInputMessage : "";
  const isSending = useSelector(selectIsSending);
  const sendError = useSelector(selectSendError);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const [editingMessage, setEditingMessage] = useState(null);
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isAiThinking, setIsAiThinkingState] = useState(false);
  const aiThinkingTimerRef = useRef(null);

  const messages = useSelector((state) => state.chat.messages || []);
  const prevMsgLengthRef = useRef(messages.length);

  const clearAiThinking = useCallback(() => {
    setIsAiThinkingState(false);
    if (aiThinkingTimerRef.current) {
      clearTimeout(aiThinkingTimerRef.current);
      aiThinkingTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (messages.length > prevMsgLengthRef.current) {
      prevMsgLengthRef.current = messages.length;
      const lastMsg = messages[messages.length - 1];
      const sender = String(lastMsg?.senderName || lastMsg?.sender?.username || "").toLowerCase();
      const isFromAI = sender.includes("gemini") || sender.includes("ai") || Boolean(lastMsg?.fileTree || lastMsg?.isAi);
      if (isFromAI) {
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
      }, 10000);
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

  const startEditMessage = useCallback(
    (msg) => {
      if (!msg) {
        setEditingMessage(null);
        return;
      }
      setEditingMessage(msg);
      dispatch(setInputMessageAction(msg.message ?? ""));
    },
    [dispatch]
  );

  const cancelEditMessage = useCallback(() => {
    setEditingMessage(null);
    dispatch(setInputMessageAction(""));
  }, [dispatch]);

  const startReplyMessage = useCallback((msg) => {
    if (!msg) {
      setReplyToMessage(null);
      return;
    }
    const id = msg._id ?? msg.id;
    const senderName = msg.senderName || "User";
    const rawMsg = msg.message;
    const text = typeof rawMsg === "string" ? rawMsg : JSON.stringify(rawMsg || "");
    setReplyToMessage({ id, senderName, text: text.slice(0, 100) });
  }, []);

  const cancelReplyMessage = useCallback(() => {
    setReplyToMessage(null);
  }, []);

  const updateTypingUser = useCallback(({ userId, username, isTyping }) => {
    if (!userId) return;

    setTypingUsers((current) => {
      const withoutUser = current.filter((user) => String(user.userId) !== String(userId));
      return isTyping
        ? [...withoutUser, { userId, username: username || "A collaborator" }]
        : withoutUser;
    });
  }, []);

  const clearTypingUsers = useCallback(() => {
    setTypingUsers([]);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    const trimmed = String(inputMessage ?? "").trim();
    if (!editingMessage || !trimmed) return;
    const id = editingMessage.id ?? editingMessage._id;
    const newMessage = trimmed;

    dispatch(updateMessageAction({ id, message: newMessage }));
    dispatch(setInputMessageAction(""));
    setEditingMessage(null);

    try {
      await sendMessage("project-message-edit", { id, message: newMessage });
    } catch (err) {
      console.warn("Socket edit message error:", err);
    }
  }, [dispatch, editingMessage, inputMessage]);

  const handleSend = useCallback(async () => {
    if (editingMessage) {
      await handleSaveEdit();
      return;
    }

    const message = inputMessage.trim();
    if (!message || !user?._id || isSending) return;

    const activeReply = replyToMessage;

    dispatch(setInputMessageAction(""));
    dispatch(setSendErrorAction(""));
    dispatch(setIsSendingAction(true));
    setReplyToMessage(null);

    if (message.toLowerCase().includes("@ai")) {
      setIsAiThinking(true);
    }

    try {
      await sendMessage("project-message", { message, replyTo: activeReply });
    } catch (error) {
      dispatch(setInputMessageAction(message));
      dispatch(setSendErrorAction(error.message));
      setReplyToMessage(activeReply);
    } finally {
      dispatch(setIsSendingAction(false));
    }
  }, [dispatch, editingMessage, handleSaveEdit, inputMessage, isSending, user?._id, replyToMessage]);

  const handleSendVoiceMessage = useCallback(async ({ audioUrl, duration, sendToAI }) => {
    if (!audioUrl || !user?._id || isSending || editingMessage) return;

    const activeReply = replyToMessage;
    const aiTrigger = sendToAI ? inputMessage : "";
    if (sendToAI) dispatch(setInputMessageAction(""));
    dispatch(setSendErrorAction(""));
    dispatch(setIsSendingAction(true));
    setReplyToMessage(null);

    if (sendToAI || inputMessage.toLowerCase().includes("@ai")) {
      setIsAiThinking(true);
    }

    try {
      await sendMessage("project-audio-message", {
        audioUrl,
        duration,
        sendToAI: Boolean(sendToAI),
        replyTo: activeReply,
      });
    } catch (error) {
      dispatch(setSendErrorAction(error.message));
      setReplyToMessage(activeReply);
      if (aiTrigger) dispatch(setInputMessageAction(aiTrigger));
    } finally {
      dispatch(setIsSendingAction(false));
    }
  }, [dispatch, editingMessage, inputMessage, isSending, replyToMessage, user?._id]);

  const handleDeleteMessage = useCallback(
    async (id) => {
      if (!id) return;
      dispatch(deleteMessageAction(id));
      try {
        await sendMessage("project-message-delete", { id });
      } catch (err) {
        console.warn("Socket delete message error:", err);
      }
    },
    [dispatch]
  );

  const handleTogglePinMessage = useCallback(
    async (id) => {
      if (!id) return;
      dispatch(togglePinMessageAction({ id }));
      try {
        await sendMessage("project-message-pin", { id });
      } catch (err) {
        console.warn("Socket pin message error:", err);
      }
    },
    [dispatch]
  );

  const handleToggleReaction = useCallback(
    async (id, emoji) => {
      if (!id || !emoji) return;
      try {
        await sendMessage("project-message-react", { id, emoji });
      } catch (err) {
        console.warn("Socket react message error:", err);
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      inputMessage,
      setInputMessage,
      handleSend,
      handleSendVoiceMessage,
      editingMessage,
      startEditMessage,
      cancelEditMessage,
      replyToMessage,
      startReplyMessage,
      cancelReplyMessage,
      handleSaveEdit,
      handleDeleteMessage,
      handleTogglePinMessage,
      handleToggleReaction,
      isSending,
      sendError,
      typingUsers,
      updateTypingUser,
      clearTypingUsers,
      isAiThinking,
      setIsAiThinking,
    }),
    [
      inputMessage,
      setInputMessage,
      handleSend,
      handleSendVoiceMessage,
      editingMessage,
      startEditMessage,
      cancelEditMessage,
      replyToMessage,
      startReplyMessage,
      cancelReplyMessage,
      handleSaveEdit,
      handleDeleteMessage,
      handleTogglePinMessage,
      handleToggleReaction,
      isSending,
      sendError,
      typingUsers,
      updateTypingUser,
      clearTypingUsers,
      isAiThinking,
      setIsAiThinking,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
