import { memo, useMemo } from "react";
import ChatMessageBubble from "./ChatMessageBubble";
import { useUser } from "../../../contexts/user.context";
import { useMessages } from "../../../contexts/Messages.context";

const ChatMessages = ({ chatEndRef }) => {
  const { user: currentUser } = useUser();
  const {messages} = useMessages()

  const currentUserId = currentUser?._id;

  const renderedMessages = useMemo(() => {
    return messages.map((msg) => ({
      ...msg,
      isMine: msg.senderId === currentUserId,
    }));
  }, [messages, currentUserId]);

  return (
    <>
      {/* Chat messages */}
      <section className="flex-1 overflow-y-auto px-4 py-5 space-y-4 scrollbar-hide bg-transparent">
        {messages.length === 0 ? (
          // if their is no chats then show this text
          <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm select-none text-center">
            <p>Start a conversation with your AI or teammates 👋</p>
            <br />
            <p>@ai for conversation with AI</p>
          </div>
        ) : (
          // chat messages
          renderedMessages.map((msg, index) => (
            <ChatMessageBubble
              key={msg._id || index}
              msg={msg}
              isMine={msg.isMine}
            />
          ))
        )}
        <div ref={chatEndRef}></div>
      </section>
    </>
  );
};

export default memo(ChatMessages);