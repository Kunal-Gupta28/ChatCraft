import { useState, useEffect, useRef, lazy, Suspense, useCallback } from "react";
import { Users, MessageCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProject } from "../../../contexts/project.context";
import { useMessages } from "../../../contexts/Messages.context";
import { useChat } from "../../../contexts/chat.context";

import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import Header from "./Header";

// lazy load
const Collaborators = lazy(() => import("./collaborator/Collaborators"));

const Chat = () => {
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
          <Header
            leftIcon={<ArrowLeft size={20} />}
            onLeftClick={() => navigate("/home")}
            centerContent={
              <div className="flex items-center gap-2">
                <MessageCircle className="text-blue-400" size={20} />
                <span className="truncate max-w-[180px]">
                  {project?.projectName || "Untitled"}
                </span>
              </div>
            }
            rightActions={[
              {
                icon: <Users size={20} />,
                onClick: () => setShowUsers(true),
              },
            ]}
          />
          <ChatMessages chatEndRef={chatEndRef} />
          <ChatInput handleKeyPress={handleKeyPress} />
        </>
      )}
    </div>
  );
};

export default Chat;