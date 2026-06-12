// contexts/chat.context.js
import { createContext, useContext, useState, useCallback } from "react";
import { useUser } from "./user.context";
import { sendMessage } from "../config/socket";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useUser();
  const [inputMessage, setInputMessage] = useState("");
  const [sendError, setSendError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = useCallback(async () => {
    const message = inputMessage.trim();
    if (!message || !user?._id || isSending) return;

    setInputMessage("");
    setSendError("");
    setIsSending(true);

    try {
      await sendMessage("project-message", { message });
    } catch (error) {
      setInputMessage(message);
      setSendError(error.message);
    } finally {
      setIsSending(false);
    }
  }, [inputMessage, isSending, user?._id]);

  return (
    <ChatContext.Provider
      value={{
        inputMessage,
        setInputMessage,
        handleSend,
        isSending,
        sendError,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
