const ChatMessageBubble = ({ msg, isMine }) => {

  // time stamp
  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

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

        {/* show time stamp */}
        <time className="block text-xs text-right mt-1 opacity-60 select-none">
          {formatTimestamp(msg.timestamp)}
        </time>
      </div>
    </div>
  );
};

export default ChatMessageBubble;
