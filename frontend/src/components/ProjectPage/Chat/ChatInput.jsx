import { memo, useCallback } from "react";
import { SendHorizonal } from "lucide-react";
import { useChat } from "../../../contexts/chat.context";

const ChatInput = ({ handleKeyPress }) => {
  const { inputMessage, setInputMessage, handleSend, isSending, sendError } =
    useChat();

  const isDisabled = !inputMessage.trim() || isSending;

  const handleChange = useCallback((e) => {
    setInputMessage(e.target.value);
  }, [setInputMessage]);

  return (
    <footer className="flex flex-col gap-2 p-4 border-t border-gray-700 bg-gray-900/30 backdrop-blur-md">
      {sendError && <p className="text-xs text-red-400">{sendError}</p>}
      <div className="flex items-center gap-3 w-full">
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
      </div>
    </footer>
  );
};

export default memo(ChatInput);
