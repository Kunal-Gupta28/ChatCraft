import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/user.context";
import { useProject } from "../contexts/project.context"
import Collaborators from "./Collaborators";
import { Users, MessageCircle, SendHorizonal, ArrowLeft } from "lucide-react";

const ChatSection = ({
  messages,
  handleSend,
  newMessage,
  setNewMessage,
}) => {
  const { user: currentUser } = useUser();
  const { project :currentProject } = useProject();
  const [showUsers, setShowUsers] = useState(false);

  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderChatView = () => (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 border-b border-gray-700 bg-gray-900/30 backdrop-blur-md">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="flex items-center gap-2">
          <MessageCircle className="text-blue-400" size={22} />
          <h2 className="text-lg font-semibold text-gray-100 truncate max-w-[180px] md:max-w-[240px]">
            {currentProject?.name || "Untitled Project"}
          </h2>
        </div>

        <button
          onClick={() => setShowUsers(true)}
          className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-blue-400 transition"
        >
          <Users size={22} />
        </button>
      </header>

      {/* Chat messages */}
      <section className="flex-1 overflow-y-auto px-4 py-5 space-y-4 scrollbar-hide bg-transparent">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            Start a conversation with your AI or teammates 👋
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.senderId === currentUser._id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] md:max-w-[75%] px-3 py-2 rounded-2xl shadow-sm ${
                  msg.senderId === currentUser._id
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-700 text-gray-200 rounded-bl-none border border-gray-600"
                }`}
              >
                <strong className="block text-xs font-bold mb-1 opacity-80">
                  {msg.senderName}
                </strong>

                {msg.senderName === "AI" ? (
                  <div className="prose prose-sm prose-invert max-w-none text-sm break-words leading-4">
                    {msg.message}
                  </div>
                ) : (
                  <p className="text-sm break-words leading-4">
                    {typeof msg.message === "string"
                      ? msg.message
                      : JSON.stringify(msg.message, null, 2)}
                  </p>
                )}

                <time className="block text-xs text-right mt-1 opacity-60">
                  {formatTimestamp(msg.timestamp)}
                </time>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef}></div>
      </section>

      {/* Input box */}
      <footer className="flex items-center gap-3 p-4 border-t border-gray-700 bg-gray-900/30 backdrop-blur-md">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-4 py-2 text-sm bg-gray-800 border border-gray-700 rounded-full text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={!newMessage.trim()}
          className="p-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition disabled:bg-blue-900 disabled:opacity-60"
        >
          <SendHorizonal size={20} />
        </button>
      </footer>
    </>
  );

  return (
    <div className="w-full h-full flex flex-col bg-transparent backdrop-blur-md">
      {showUsers ? (
        <Collaborators setShowUsers={setShowUsers} />
      ) : (
        renderChatView()
      )}
    </div>
  );
};

export default ChatSection;
