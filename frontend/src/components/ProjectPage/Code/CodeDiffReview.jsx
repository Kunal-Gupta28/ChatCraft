import { memo, useMemo, useState } from "react";
import { Check, CheckCircle2, FileCode2, FilePlus2, Loader2, X } from "lucide-react";
import { getFileTreeDiffs, mergeFileTrees } from "../../../utils/fileTree";

const CodeDiffReview = ({ currentFileTree, suggestion, onApply, onClose, onCancel, isChatVisible }) => {
  const diffs = useMemo(
    () => getFileTreeDiffs(currentFileTree, suggestion?.fileTree),
    [currentFileTree, suggestion?.fileTree]
  );
  const [selectedPath, setSelectedPath] = useState(diffs[0]?.path || "");
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState("");

  const handleCancelClick = () => {
    if (typeof onCancel === "function") {
      onCancel();
    } else {
      onClose();
    }
  };

  const selectedDiff = diffs.find((d) => d.path === selectedPath) || diffs[0];

  const handleApply = async () => {
    try {
      setIsApplying(true);
      setError("");
      const mergedTree = mergeFileTrees(currentFileTree, suggestion?.fileTree);
      await onApply({
        fileTree: mergedTree,
        buildCommand: suggestion?.buildCommand,
        startCommand: suggestion?.startCommand,
        changedFiles: diffs.map((d) => d.path),
      });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to apply code changes.");
      setIsApplying(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#07090e] border border-slate-800/80 rounded-xl overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-[#0c101a] px-4 py-2.5 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
            <FileCode2 size={16} />
          </div>
          <div>
            <p className="text-xs font-bold text-white tracking-wide">Review AI Suggested Changes</p>
            <p className="text-[10px] text-slate-400 font-mono">
              {diffs.length} file{diffs.length !== 1 ? "s" : ""} modified by Gemini AI
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={isApplying}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer disabled:opacity-40"
          title="Close review"
        >
          <X size={16} />
        </button>
      </div>

      {/* Main Diff Area */}
      <div className="flex min-h-0 flex-1 flex-col md:flex-row overflow-hidden">
        {/* File selector sidebar */}
        <div className="shrink-0 border-b border-slate-800/80 bg-[#090c14] p-2 md:w-52 md:border-b-0 md:border-r md:overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-1 mb-1">
            Changed Files
          </div>
          {diffs.length > 0 ? (
            diffs.map((diff) => {
              const active = (selectedDiff?.path || selectedPath) === diff.path;
              return (
                <button
                  key={diff.path}
                  type="button"
                  onClick={() => setSelectedPath(diff.path)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-mono transition-all cursor-pointer ${
                    active
                      ? "bg-cyan-500/15 text-cyan-200 border border-cyan-400/30 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  {diff.kind === "added" ? (
                    <FilePlus2 size={13} className="shrink-0 text-emerald-400" />
                  ) : (
                    <FileCode2 size={13} className="shrink-0 text-blue-400" />
                  )}
                  <span className="truncate flex-1">{diff.path}</span>
                </button>
              );
            })
          ) : (
            <p className="px-2.5 py-2 text-[10px] text-slate-500 italic font-mono">0 files modified</p>
          )}
        </div>

        {/* Diff Code View */}
        <div className="min-h-0 flex-1 flex flex-col p-3 overflow-hidden bg-[#07090e]">
          {selectedDiff ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-semibold text-slate-300 truncate">
                  {selectedDiff.path}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                    selectedDiff.kind === "added"
                      ? "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20"
                      : "text-amber-400 bg-amber-400/10 border border-amber-400/20"
                  }`}
                >
                  {selectedDiff.kind === "added" ? "+ new file" : "~ modified"}
                </span>
              </div>

              <div className="grid min-h-0 flex-1 grid-cols-1 gap-2.5 md:grid-cols-2 overflow-hidden">
                <CodePanel
                  label="CURRENT CODE"
                  code={selectedDiff.previous}
                  compareCode={selectedDiff.next}
                  emptyLabel="File does not exist"
                  isSuggested={false}
                />
                <CodePanel
                  label="SUGGESTED CODE"
                  code={selectedDiff.next}
                  compareCode={selectedDiff.previous}
                  emptyLabel="File removed"
                  isSuggested={true}
                />
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10 animate-in zoom-in-95 duration-200">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Changes Already Applied</h3>
                <p className="text-xs text-slate-400 max-w-sm font-sans leading-relaxed">
                  All suggested files in this recommendation have been applied to your workspace code.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mt-1 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white transition shadow-md cursor-pointer border border-slate-700/80 active:scale-95"
              >
                Close Review
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Bar */}
      <div
        className={`relative z-20 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 bg-[#090c14] px-4 py-3 shrink-0 transition-all duration-300 ${
          isChatVisible ? "pr-4 lg:pr-[440px]" : "pr-4"
        }`}
      >
        {error ? (
          <p className="text-xs font-medium text-red-400">{error}</p>
        ) : (
          <p className="text-xs text-slate-400 truncate max-w-full">Review diff changes and apply to workspace code.</p>
        )}

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleCancelClick}
            disabled={isApplying}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer disabled:opacity-40"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApply}
            disabled={!diffs.length || isApplying}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white transition shadow-md shadow-cyan-500/20 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isApplying ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
            Apply {diffs.length} Change{diffs.length !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

const CodePanel = ({ label, code, compareCode, emptyLabel, isSuggested }) => {
  const lines = useMemo(() => (code ? code.split("\n") : []), [code]);
  const compareSet = useMemo(() => {
    if (!compareCode) return new Set();
    return new Set(compareCode.split("\n").map((l) => l.trim()));
  }, [compareCode]);

  return (
    <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-slate-800/90 bg-[#05070d]">
      <div className="border-b border-slate-800/80 px-3 py-1.5 flex items-center justify-between bg-[#080b12]">
        <span className={`text-[10px] font-bold tracking-widest ${isSuggested ? "text-cyan-400" : "text-slate-400"}`}>
          {label}
        </span>
        {code && <span className="text-[10px] font-mono text-slate-500">{lines.length}L</span>}
      </div>

      {code ? (
        <div className="min-h-0 flex-1 overflow-auto font-mono text-[11px] leading-[1.6] select-text py-1">
          {lines.map((line, idx) => {
            const changed = compareCode ? !compareSet.has(line.trim()) : false;
            const rowClass = changed
              ? isSuggested
                ? "bg-emerald-500/10 border-l-2 border-emerald-400 text-emerald-200 font-semibold"
                : "bg-rose-500/10 border-l-2 border-rose-400 text-rose-200 font-semibold"
              : "text-slate-400";
            const prefixChar = changed ? (isSuggested ? "+" : "−") : " ";
            const prefixClass = changed
              ? isSuggested ? "text-emerald-400" : "text-rose-400"
              : "text-transparent";

            return (
              <div key={idx} className={`flex items-start px-3 ${rowClass}`}>
                <span className="w-7 shrink-0 text-right text-[10px] text-slate-600 select-none mr-2 py-0.5">{idx + 1}</span>
                <span className={`w-3 shrink-0 select-none mr-1 py-0.5 font-bold ${prefixClass}`}>{prefixChar}</span>
                <span className="flex-1 whitespace-pre break-all py-0.5">{line || " "}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center p-4 text-xs text-slate-600 italic font-mono">
          {emptyLabel}
        </div>
      )}
    </div>
  );
};

export default memo(CodeDiffReview);
