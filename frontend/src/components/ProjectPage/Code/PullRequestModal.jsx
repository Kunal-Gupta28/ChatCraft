import { useState } from "react";
import { GitPullRequest, Check, X, ArrowRight, ShieldCheck, AlertCircle, FileCode2 } from "lucide-react";
import { getFileTreeDiffs } from "../../../utils/fileTree";

const PullRequestModal = ({
  isOpen, onClose, mode, // "submit" | "review"
  mainFileTree, localFileTree, pendingPRs = [],
  onSubmitPR, onApprovePR, onRejectPR
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPRIndex, setSelectedPRIndex] = useState(0);

  if (!isOpen) return null;

  const diffs = mode === "submit"
    ? getFileTreeDiffs(mainFileTree, localFileTree)
    : (pendingPRs[selectedPRIndex] ? getFileTreeDiffs(mainFileTree, pendingPRs[selectedPRIndex].proposedTree) : []);

  const activePR = pendingPRs[selectedPRIndex];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmitPR({ title: title.trim(), description: description.trim(), proposedTree: localFileTree });
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 select-none font-sans" onClick={onClose}>
      <div className="w-full max-w-2xl bg-[#090c15] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-[#0c101d] border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <GitPullRequest size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {mode === "submit" ? "Submit Code Merge Proposal (PR)" : "Pending Pull Requests (Code Review)"}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {mode === "submit" ? "Propose your local changes to Project Owner" : `${pendingPRs.length} proposal(s) awaiting merge review`}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 font-mono text-xs">
          {mode === "submit" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">PR Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Added user controller & auth routes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#111625] border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Summarize your changes for the project owner..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#111625] border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs font-mono resize-none"
                />
              </div>

              {/* Diffs Summary */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Changed Files ({diffs.length})</span>
                </div>
                {diffs.length === 0 ? (
                  <div className="p-4 rounded-xl border border-slate-800 bg-[#06080e] text-slate-500 text-center italic">
                    No file changes detected vs main branch
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-44 overflow-y-auto">
                    {diffs.map((d) => (
                      <div key={d.path} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-800 bg-[#06080e] text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <FileCode2 size={14} className="text-indigo-400 shrink-0" />
                          <span className="text-slate-200 truncate">{d.path}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          d.kind === "added" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                        }`}>
                          {d.kind}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-800">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold cursor-pointer">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={diffs.length === 0 || !title.trim()}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  <GitPullRequest size={14} />
                  <span>Submit PR to Owner</span>
                </button>
              </div>
            </form>
          ) : (
            /* Project Owner PR Review Mode */
            <div className="space-y-5">
              {pendingPRs.length === 0 ? (
                <div className="p-8 rounded-2xl border border-slate-800 bg-[#06080e] text-center space-y-2">
                  <ShieldCheck size={32} className="text-emerald-400 mx-auto" />
                  <p className="text-sm font-bold text-white">No Pending Pull Requests</p>
                  <p className="text-xs text-slate-400 font-sans">Main branch is up to date and clean.</p>
                </div>
              ) : (
                <>
                  {/* PR Selector Selector */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {pendingPRs.map((pr, idx) => (
                      <button
                        key={pr.id || idx}
                        type="button"
                        onClick={() => setSelectedPRIndex(idx)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition cursor-pointer shrink-0 ${
                          selectedPRIndex === idx
                            ? "bg-indigo-600/20 border-indigo-500 text-white font-bold"
                            : "bg-[#06080e] border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        PR #{idx + 1}: {pr.title}
                      </button>
                    ))}
                  </div>

                  {activePR && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl border border-slate-800 bg-[#06080e] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">{activePR.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">By: {activePR.author?.username || "Collaborator"}</span>
                        </div>
                        {activePR.description && <p className="text-xs text-slate-400 font-sans">{activePR.description}</p>}
                      </div>

                      {/* File Diffs List */}
                      <div>
                        <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2 block">Proposed Changes ({diffs.length})</span>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto">
                          {diffs.map((d) => (
                            <div key={d.path} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-800 bg-[#06080e] text-xs">
                              <div className="flex items-center gap-2 truncate">
                                <FileCode2 size={14} className="text-indigo-400 shrink-0" />
                                <span className="text-slate-200 truncate">{d.path}</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                d.kind === "added" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                              }`}>
                                {d.kind}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => { onRejectPR(activePR.id); setSelectedPRIndex(0); }}
                          className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-600 hover:text-white font-bold transition cursor-pointer flex items-center gap-1.5"
                        >
                          <X size={14} /> Reject PR
                        </button>

                        <button
                          type="button"
                          onClick={() => { onApprovePR(activePR.id, activePR.proposedTree); setSelectedPRIndex(0); }}
                          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
                        >
                          <Check size={14} /> Approve & Merge to Main
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PullRequestModal;
