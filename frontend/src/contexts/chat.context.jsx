// contexts/chat.context.js
import { createContext, useContext, useState, useCallback } from "react";
import { useUser } from "./user.context";
import { useMessages } from "./Messages.context";
import { sendMessage } from "../config/socket";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useUser();
  const { setMessages } = useMessages();

  const [inputMessage, setInputMessage] = useState("");

  const handleSend = useCallback(() => {
    if (!inputMessage.trim() || !user?._id) return;

    const msg = {
      senderId: user._id,
      senderName: user.username,
      message: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, msg]);
    setInputMessage("");
    sendMessage("project-message", msg);
  }, [inputMessage, user]);

  return (
    <ChatContext.Provider
      value={{
        inputMessage,
        setInputMessage,
        handleSend,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);