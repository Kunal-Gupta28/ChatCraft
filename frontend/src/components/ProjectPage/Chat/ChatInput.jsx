import { memo, useCallback } from "react";
import { SendHorizonal } from "lucide-react";
import { useChat } from "../../../contexts/chat.context";

const ChatInput = ({ handleKeyPress }) => {
  const { inputMessage, setInputMessage, handleSend } = useChat();

  const isDisabled = !inputMessage.trim();

  const handleChange = useCallback((e) => {
    setInputMessage(e.target.value);
  }, [setInputMessage]);

  return (
    <footer className="flex items-center gap-3 p-4 border-t border-gray-700 bg-gray-900/30 backdrop-blur-md">
      <input
        type="text"
        placeholder="Type your message..."
        value={inputMessage}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        className="flex-1 px-4 py-2 text-sm bg-gray-800 border border-gray-700 
                   rounded-full text-gray-200 placeholder-gray-400 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleSend}
        disabled={isDisabled}
        className={`
          p-2.5 rounded-full text-white transition-all duration-150
          ${
            isDisabled
              ? "bg-blue-900 opacity-60 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-90 cursor-pointer"
          }
        `}
      >
        <SendHorizonal size={20} />
      </button>
    </footer>
  );
};

export default memo(ChatInput);