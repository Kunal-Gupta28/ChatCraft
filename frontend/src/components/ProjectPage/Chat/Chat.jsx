import { useState, useEffect, useRef } from "react";
import Collaborators from "./Collaborators";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const Chat = ({ messages, handleSend, inputMessage, setInputMessage }) => {
  // state variable
  const [showUsers, setShowUsers] = useState(false);

  // use ref
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // send message on pressing enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-transparent backdrop-blur-md">
      {/* if showUser is true then show collaborators  if not then show chat box */}
      {showUsers ? (
        <Collaborators setShowUsers={setShowUsers} />
      ) : (
        <>
          {/* chat box */}
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
