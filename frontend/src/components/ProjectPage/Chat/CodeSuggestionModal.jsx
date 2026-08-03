import { memo, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Check, FileCode2, FilePlus2, Loader2, X } from "lucide-react";
import { getFileTreeDiffs, mergeFileTrees } from "../../../utils/fileTree";

const CodeSuggestionModal = ({ open, onClose, onApply, currentFileTree, suggestion, isApplying, error }) => {
  const diffs = useMemo(
    () => getFileTreeDiffs(currentFileTree, suggestion?.fileTree),
    [currentFileTree, suggestion?.fileTree],
  );
  const [selectedPath, setSelectedPath] = useState("");

  useEffect(() => {
    setSelectedPath(diffs[0]?.path || "");
  }, [diffs]);

  if (!open) return null;

  const selectedDiff = diffs.find((d) => d.path === selectedPath) || diffs[0];

  const applySuggestion = () => {
    onApply({
      fileTree: mergeFileTrees(currentFileTree, suggestion?.fileTree),
      buildCommand: suggestion?.buildCommand,
      startCommand: suggestion?.startCommand,
      changedFiles: diffs.map((d) => d.path),
    });
  };

  const modal = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="flex h-[min(800px,90vh)] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-white/8 bg-[#0a0c10] shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/6 px-5 py-3.5">
          <div>
            <p className="text-sm font-semibold text-white">Review changes</p>
            <p className="text-xs text-slate-500 mt-0.5">{diffs.length} file{diffs.length !== 1 ? "s" : ""} modified by AI</p>
          </div>
          <button
            onClick={onClose}
            disabled={isApplying}
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/6 transition disabled:opacity-40"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          {/* File list */}
          <div className="shrink-0 border-b border-white/6 bg-[#080a0e] p-2 md:w-56 md:border-b-0 md:border-r md:overflow-y-auto">
            {diffs.map((diff) => {
              const active = selectedDiff?.path === diff.path;
              return (
                <button
                  key={diff.path}
                  onClick={() => setSelectedPath(diff.path)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-xs font-mono transition-all ${
                    active ? "bg-white/8 text-white" : "text-slate-500 hover:text-slate-300 hover:bg-white/4"
                  }`}
                >
                  {diff.kind === "added"
                    ? <FilePlus2 size={13} className="shrink-0 text-emerald-400" />
                    : <FileCode2 size={13} className="shrink-0 text-blue-400" />
                  }
                  <span className="truncate flex-1">{diff.path}</span>
                </button>
              );
            })}
          </div>

          {/* Diff panel */}
          <div className="min-h-0 flex-1 flex flex-col p-3">
            {selectedDiff ? (
              <>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-mono text-slate-400 truncate">{selectedDiff.path}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                    selectedDiff.kind === "added"
                      ? "text-emerald-400 bg-emerald-400/8"
                      : "text-amber-400 bg-amber-400/8"
                  }`}>
                    {selectedDiff.kind === "added" ? "new file" : "modified"}
                  </span>
                </div>
                <div className="grid min-h-0 flex-1 grid-cols-1 gap-2.5 md:grid-cols-2">
                  <CodePanel
                    label="Current"
                    code={selectedDiff.previous}
                    compareCode={selectedDiff.next}
                    emptyLabel="File doesn't exist"
                    isSuggested={false}
                  />
                  <CodePanel
                    label="Suggested"
                    code={selectedDiff.next}
                    compareCode={selectedDiff.previous}
                    emptyLabel="File removed"
                    isSuggested={true}
                  />
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-600">
                No changes to show.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/6 bg-[#080a0e] px-5 py-3">
          {error
            ? <p className="text-xs text-rose-400">{error}</p>
            : <p className="text-xs text-slate-600">Changes sync to all collaborators on apply.</p>
          }
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isApplying}
              className="px-3.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/6 transition disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              onClick={applySuggestion}
              disabled={!diffs.length || isApplying}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white text-black hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isApplying ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
              Apply {diffs.length} change{diffs.length !== 1 ? "s" : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

const CodePanel = ({ label, code, compareCode, emptyLabel, isSuggested }) => {
  const lines = useMemo(() => (code ? code.split("\n") : []), [code]);
  const compareSet = useMemo(() => {
    if (!compareCode) return new Set();
    return new Set(compareCode.split("\n").map((l) => l.trim()));
  }, [compareCode]);

  return (
    <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-white/6 bg-[#060810]">
      <div className="border-b border-white/6 px-3 py-1.5 flex items-center justify-between bg-[#07090d]">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{label}</span>
        {code && <span className="text-[10px] font-mono text-slate-600">{lines.length}L</span>}
      </div>

      {code ? (
        <div className="min-h-0 flex-1 overflow-auto font-mono text-[11px] leading-[1.6] select-text py-1">
          {lines.map((line, idx) => {
            const changed = compareCode ? !compareSet.has(line.trim()) : false;
            const rowClass = changed
              ? isSuggested
                ? "bg-emerald-500/8 border-l border-emerald-500/50 text-emerald-200"
                : "bg-rose-500/8 border-l border-rose-500/50 text-rose-200"
              : "text-slate-400";
            const prefixChar = changed ? (isSuggested ? "+" : "−") : " ";
            const prefixClass = changed
              ? isSuggested ? "text-emerald-500" : "text-rose-500"
              : "text-transparent";

            return (
              <div key={idx} className={`flex items-start px-3 ${rowClass}`}>
                <span className="w-7 shrink-0 text-right text-[10px] text-slate-700 select-none mr-2 py-0.5">{idx + 1}</span>
                <span className={`w-3 shrink-0 select-none mr-1 py-0.5 ${prefixClass}`}>{prefixChar}</span>
                <span className="flex-1 whitespace-pre break-all py-0.5">{line || " "}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center p-4 text-xs text-slate-700 italic font-mono">
          {emptyLabel}
        </div>
      )}
    </div>
  );
};

export default memo(CodeSuggestionModal);
