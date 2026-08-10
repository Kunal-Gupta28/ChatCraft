import { memo } from "react";
import { Mic, SendHorizonal, Bot } from "lucide-react";

const formatRecordingTime = (seconds) =>
  `0:${String(Math.min(seconds, 60)).padStart(2, "0")}`;

const VoiceRecorderBar = ({
  isRecording,
  recordingSeconds,
  onStopAndSendUser,
  onStopAndSendAI,
  onCancel,
}) => {
  if (!isRecording) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[#090e18] border border-cyan-500/30 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-150 font-sans min-w-0">
      <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs shrink-0">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
        </span>
        <Mic size={14} className="text-cyan-400 animate-pulse shrink-0" />
        <span className="font-bold text-[11px] sm:text-xs">Recording...</span>
        <span className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] font-bold text-cyan-200">
          {formatRecordingTime(recordingSeconds)}
        </span>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 ml-auto">
        <button
          type="button"
          onClick={onCancel}
          className="px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onStopAndSendUser}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition cursor-pointer shadow-sm whitespace-nowrap"
          title="Send to Chat"
        >
          <SendHorizonal size={12} />
          <span>Send</span>
        </button>

        <button
          type="button"
          onClick={onStopAndSendAI}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-cyan-500/20 active:scale-95 whitespace-nowrap"
          title="Ask AI via Voice"
        >
          <Bot size={12} />
          <span>Ask AI</span>
        </button>
      </div>
    </div>
  );
};

export default memo(VoiceRecorderBar);
