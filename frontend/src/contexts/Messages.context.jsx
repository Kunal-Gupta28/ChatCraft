import { createContext, useContext, useState } from "react";

const MessagesContext = createContext();

// Provider
export const MessagesProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  return (
    <MessagesContext.Provider
      value={{
        messages,
        setMessages,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

// custom hook
export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error("useMessages must be used inside MessagesProvider");
  }
  return context;
};