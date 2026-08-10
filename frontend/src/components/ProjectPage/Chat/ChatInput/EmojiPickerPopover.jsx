import { memo } from "react";

const POPULAR_EMOJIS = [
  "🔥", "🚀", "💡", "👍", "❤️", "🎉", "✨", "✅",
  "💻", "🤖", "⚡", "👀", "🙌", "💯", "🛠️", "⭐",
  "📦", "🎨", "🔒", "💬", "🎯", "🧠", "👋"
];

const EmojiPickerPopover = ({ show, onSelectEmoji, popoverRef }) => {
  if (!show) return null;

  return (
    <div
      ref={popoverRef}
      className="absolute bottom-full mb-2.5 left-2 z-50 p-2 bg-[#0c101a]/98 border border-slate-700/80 shadow-2xl rounded-2xl backdrop-blur-2xl grid grid-cols-6 gap-1 select-none animate-in fade-in zoom-in-95 duration-150"
    >
      {POPULAR_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onSelectEmoji(emoji)}
          className="w-8 h-8 rounded-xl hover:bg-slate-800/80 flex items-center justify-center text-base transition cursor-pointer active:scale-125"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default memo(EmojiPickerPopover);
