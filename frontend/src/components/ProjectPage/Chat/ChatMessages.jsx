import ChatMessageBubble from "./ChatMessageBubble";
import { useUser } from "../../../contexts/user.context";

const ChatMessages = ({ messages, chatEndRef }) => {
  const { user: currentUser } = useUser();

  return (
    <>
      {/* Chat messages */}
      <section className="flex-1 overflow-y-auto px-4 py-5 space-y-4 scrollbar-hide bg-transparent">
        {messages.length === 0 ? (
          // if their is no chats then show this text
          <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm select-none space-y-1 text-center">
            <p>Start a conversation with your AI or teammates 👋</p>
            <br />
            <p>@ai for conversation with AI</p>
          </div>
        ) : (
          // chat messages
          messages.map((msg, index) => (
            <ChatMessageBubble
              key={index}
              msg={msg}
              isMine={msg.senderId === currentUser._id}
            />
          ))
        )}
        <div ref={chatEndRef}></div>
      </section>
    </>
  );
};

export default ChatMessages;
