import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  setInputMessage as setInputMessageAction,
  updateMessage as updateMessageAction,
  deleteMessage as deleteMessageAction,
  togglePinMessage as togglePinMessageAction,
} from "../store/slices/chatSlice";
import { sendMessage } from "../config/socket";

export const useChatActions = ({ inputMessage }) => {
  const dispatch = useDispatch();
  const [editingMessage, setEditingMessage] = useState(null);
  const [replyToMessage, setReplyToMessage] = useState(null);

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

  const handleDelete = useCallback((msgOrId) => {
    const id = typeof msgOrId === "object" ? (msgOrId._id ?? msgOrId.id) : msgOrId;
    if (!id) return;
    dispatch(deleteMessageAction(id));
    sendMessage("project-message-delete", { id }).catch((err) => {
      console.warn("Socket delete error:", err);
    });
  }, [dispatch]);

  const handleTogglePin = useCallback((msgOrId) => {
    const id = typeof msgOrId === "object" ? (msgOrId._id ?? msgOrId.id) : msgOrId;
    if (!id) return;
    dispatch(togglePinMessageAction(id));
    sendMessage("project-message-pin", { id }).catch((err) => {
      console.warn("Socket pin error:", err);
    });
  }, [dispatch]);

  const handleToggleReaction = useCallback((msgOrId, emoji) => {
    const id = typeof msgOrId === "object" ? (msgOrId._id ?? msgOrId.id) : msgOrId;
    if (!id || !emoji) return;
    sendMessage("project-message-react", { id, emoji }).catch((err) => {
      console.warn("Socket reaction error:", err);
    });
  }, []);

  return {
    editingMessage, setEditingMessage, replyToMessage, setReplyToMessage,
    startEditMessage, cancelEditMessage, startReplyMessage, cancelReplyMessage,
    handleSaveEdit, handleDelete, handleTogglePin, handleToggleReaction
  };
};
