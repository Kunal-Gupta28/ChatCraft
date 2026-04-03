import { memo, useMemo } from "react";

const ChatMessageBubble = ({ msg, isMine }) => {

  // time stamp
  const formattedTime = useMemo(() => {
    if (!msg?.timestamp) return "";
    const date = new Date(msg.timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, [msg?.timestamp]);

  const messageContent = useMemo(() => {
    if (typeof msg.message === "string") return msg.message;
    return JSON.stringify(msg.message, null, 2);
  }, [msg.message]);

  const isAI = msg.senderName === "AI";

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] md:max-w-[75%] px-3 py-2 rounded-2xl shadow-sm ${
          isMine
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-700 text-gray-200 rounded-bl-none border border-gray-600"
        }`}
      >
        {/* sender name */}
        <strong className="block text-xs font-bold mb-1 opacity-80 select-none">
          {msg.senderName}
        </strong>

        {/* if message from AI */}
        {isAI ? (
          <div className="prose prose-sm prose-invert max-w-none text-sm break-words leading-4">
            {messageContent}
          </div>
        ) : (
          <p className="text-sm break-words leading-4">
            {messageContent}
          </p>
        )}

        {/* show time stamp */}
        <time className="block text-xs text-right mt-1 opacity-60 select-none">
          {formattedTime}
        </time>
      </div>
    </div>
  );
};

export default memo(ChatMessageBubble);