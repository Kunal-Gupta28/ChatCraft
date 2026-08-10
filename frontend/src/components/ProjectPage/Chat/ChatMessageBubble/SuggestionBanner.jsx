import { memo } from "react";
import { CheckCircle2, XCircle, FileCode2 } from "lucide-react";

const SuggestionBanner = ({
  hasCodeSuggestion,
  isApplied,
  isCancelled,
  onReview,
  onUncancelReview,
}) => {
  if (!hasCodeSuggestion) return null;

  if (isApplied) {
    return (
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-[#051c12]/90 px-3 py-2 text-xs shadow-md backdrop-blur-md">
        <CheckCircle2 size={14} className="shrink-0 text-emerald-400" />
        <span className="text-[11px] font-semibold text-emerald-300">
          AI Code Suggestion Applied
        </span>
      </div>
    );
  }

  if (isCancelled) {
    return (
      <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-slate-700/50 bg-[#0c101a]/80 px-3 py-2 text-xs shadow-md backdrop-blur-md">
        <div className="flex items-center gap-2 text-slate-400">
          <XCircle size={14} className="shrink-0 text-slate-500" />
          <span className="text-[11px] font-medium text-slate-400">
            Suggestion Declined
          </span>
        </div>
        <button
          type="button"
          onClick={onUncancelReview}
          className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition cursor-pointer"
        >
          Review Again
        </button>
      </div>
    );
  }

  return (
    <div className="mt-3 flex items-center justify-between gap-2.5 rounded-xl border border-cyan-400/25 bg-[#06101e]/90 px-3 py-2 text-xs shadow-md backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-2">
        <FileCode2 size={14} className="shrink-0 text-cyan-300 animate-pulse" />
        <span className="text-[11px] font-semibold text-cyan-100 truncate">
          AI Code Suggestion Ready
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onReview}
          className="rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-2.5 py-1 text-[10px] font-bold text-white transition shadow-sm cursor-pointer active:scale-95"
        >
          Review & Apply
        </button>
      </div>
    </div>
  );
};

export default memo(SuggestionBanner);
