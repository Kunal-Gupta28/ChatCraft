import { useState, useEffect, useRef, lazy, Suspense, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useProject } from "../../../contexts/project.context";
import { useMessages } from "../../../contexts/Messages.context";
import { useChat } from "../../../contexts/chat.context";

import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import Header from "./Header";

// lazy load
const Collaborators = lazy(() => import("./collaborator/Collaborators"));

const Chat = ({ toggleChat, isChatVisible }) => {
  const [showUsers, setShowUsers] = useState(false);

  const { handleSend } = useChat();
  const chatEndRef = useRef(null);
  const prevLengthRef = useRef(0);

  const navigate = useNavigate();
  const { project } = useProject();
  const { messages } = useMessages();

  // auto scroll
  useEffect(() => {
    if (messages.length > prevLengthRef.current) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevLengthRef.current = messages.length;
  }, [messages]);

  // handle enter press
  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const memberCount = (project?.users?.length || 0) + 1; // Project owner/users + self

  return (
    <div className="w-full h-full flex flex-col bg-[#080b11]/90 backdrop-blur-2xl border-r border-slate-800/80">
      {showUsers ? (
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full text-slate-400 text-xs font-mono">
              Loading collaborators...
            </div>
          }
        >
          <Collaborators setShowUsers={setShowUsers} />
        </Suspense>
      ) : (
        <>
          <Header
            projectName={project?.projectName || "Workspace Chat"}
            memberCount={project?.users?.length || 1}
            onBack={() => navigate("/dashboard")}
            onToggleChat={toggleChat}
            onShowUsers={() => setShowUsers(true)}
          />
          <ChatMessages chatEndRef={chatEndRef} />
          <ChatInput handleKeyPress={handleKeyPress} />
        </>
      )}
    </div>
  );
};

export default Chat;