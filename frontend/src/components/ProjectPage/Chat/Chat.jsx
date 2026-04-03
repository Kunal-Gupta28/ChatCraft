import { useState, useEffect, useRef, lazy, Suspense, useCallback } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

// lazy load
const Collaborators = lazy(() => import("./Collaborators"));

const Chat = ({ messages, handleSend, inputMessage, setInputMessage }) => {
  const [showUsers, setShowUsers] = useState(false);
  const chatEndRef = useRef(null);
  const prevLengthRef = useRef(0);

  useEffect(() => {
    if (messages.length > prevLengthRef.current) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevLengthRef.current = messages.length;
  }, [messages]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <div className="w-full h-full flex flex-col bg-transparent backdrop-blur-md">
      {showUsers ? (
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full text-gray-400">
              Loading collaborators...
            </div>
          }
        >
          <Collaborators setShowUsers={setShowUsers} />
        </Suspense>
      ) : (
        <>
          <ChatHeader setShowUsers={setShowUsers} />
          <ChatMessages messages={messages} chatEndRef={chatEndRef} />
          <ChatInput
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSend={handleSend}
            handleKeyPress={handleKeyPress}
          />
        </>
      )}
    </div>
  );
};

export default Chat;