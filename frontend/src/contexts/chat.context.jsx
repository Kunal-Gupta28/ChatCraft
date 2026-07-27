import { useState, useCallback } from "react";
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
} from "../store/slices/chatSlice";
import { selectUser } from "../store/slices/userSlice";
import { sendMessage } from "../config/socket";

export const ChatProvider = ({ children }) => children;

export const useChat = () => {
  const rawInputMessage = useSelector(selectInputMessage);
  const inputMessage = typeof rawInputMessage === "string" ? rawInputMessage : "";
  const isSending = useSelector(selectIsSending);
  const sendError = useSelector(selectSendError);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const [editingMessage, setEditingMessage] = useState(null);

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
      dispatch(setInputMessageAction(msg.message || ""));
    },
    [dispatch]
  );

  const cancelEditMessage = useCallback(() => {
    setEditingMessage(null);
    dispatch(setInputMessageAction(""));
  }, [dispatch]);

  const handleSaveEdit = useCallback(async () => {
    if (!editingMessage || !inputMessage.trim()) return;
    const id = editingMessage.id || editingMessage._id;
    const newMessage = inputMessage.trim();

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

    dispatch(setInputMessageAction(""));
    dispatch(setSendErrorAction(""));
    dispatch(setIsSendingAction(true));

    try {
      await sendMessage("project-message", { message });
    } catch (error) {
      dispatch(setInputMessageAction(message));
      dispatch(setSendErrorAction(error.message));
    } finally {
      dispatch(setIsSendingAction(false));
    }
  }, [dispatch, editingMessage, handleSaveEdit, inputMessage, isSending, user?._id]);

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

  return {
    inputMessage,
    setInputMessage,
    handleSend,
    editingMessage,
    startEditMessage,
    cancelEditMessage,
    handleSaveEdit,
    handleDeleteMessage,
    isSending,
    sendError,
  };
};
