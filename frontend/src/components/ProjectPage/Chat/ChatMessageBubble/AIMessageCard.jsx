import { memo } from "react";
import { Bot, Volume2, VolumeX } from "lucide-react";
import { renderMessageWithMentions } from "./helpers.jsx";
import SuggestionBanner from "./SuggestionBanner";

const AIMessageCard = ({
  msg,
  formattedTime,
  currentUser,
  isSpeaking,
  handleSpeakMessage,
  hasCodeSuggestion,
  isApplied,
  isCancelled,
  openReviewModal,
  handleUncancelAndReview,
  showMenu,
  showReactions,
  isDeleting,
}) => {
  return (
    <div
      id={`msg-${msg._id}`}
      className={`group relative flex items-start gap-2.5 my-3 select-none transition-all duration-150 max-w-full min-w-0 ${
        showMenu || showReactions ? "z-40" : "z-0"
      } ${isDeleting ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}`}
    >
      <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-cyan-500/20 shrink-0 mt-0.5">
        <Bot size={15} />
      </div>

      <div className="max-w-[85%] sm:max-w-[78%] min-w-0 rounded-2xl border border-cyan-500/20 bg-[#090d16]/95 px-3.5 py-3 text-xs text-slate-100 shadow-xl backdrop-blur-xl relative overflow-hidden">
        <div className="flex items-center justify-between gap-2 mb-1.5 border-b border-slate-800/60 pb-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-extrabold text-cyan-300 tracking-wide">Gemini AI</span>
            <span className="text-[9px] font-mono text-cyan-400/70 bg-cyan-400/10 px-1.5 py-0.2 rounded border border-cyan-400/20">Assistant</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">{formattedTime}</span>
        </div>

        <div className="prose prose-invert prose-xs leading-relaxed max-w-none text-slate-200 break-words [overflow-wrap:anywhere] font-sans min-w-0">
          {renderMessageWithMentions(msg.message, currentUser?.username)}
        </div>

        {/* Voice Explanation Button */}
        <div className="mt-2.5 pt-2 border-t border-cyan-500/10 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleSpeakMessage}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
              isSpeaking
                ? "bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 shadow-sm"
                : "bg-cyan-400/5 text-cyan-300/80 border border-cyan-400/15 hover:bg-cyan-400/15 hover:text-cyan-200"
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX size={12} className="text-cyan-300 animate-pulse" />
                <span>Stop Voice</span>
              </>
            ) : (
              <>
                <Volume2 size={12} />
                <span>Voice Explanation</span>
              </>
            )}
          </button>
        </div>

        {/* Code Suggestion Review Banner */}
        <SuggestionBanner
          hasCodeSuggestion={hasCodeSuggestion}
          isApplied={isApplied}
          isCancelled={isCancelled}
          openReviewModal={openReviewModal}
          handleUncancelAndReview={handleUncancelAndReview}
        />
      </div>
    </div>
  );
};

export default memo(AIMessageCard);
