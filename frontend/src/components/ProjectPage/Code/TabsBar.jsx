import { memo, useCallback } from "react";
import { Play, Loader2, Folder, Code2, Eye, Sparkles, X, Network, GitPullRequest, RefreshCw, Trash2 } from "lucide-react";
import { useCodeEditor } from "../../../contexts/codeEditor.context";
import { useUser } from "../../../contexts/user.context";
import { useProject } from "../../../contexts/project.context";
import FileTab from "./FileTab";

const TabsBar = ({
  openFiles, activeFile, onSelect, onClose, activeTab, setActiveTab,
  iframeUrl, isRunning, onRun, setShowFiles, toggleChat, isChatVisible,
  editorPresence = [], pendingPRs = [], onOpenPRModal,
  isBehindMain = false, hasLocalDraft = false, onSyncMain, onDiscardDraft, modifiedFiles = {}
}) => {
  const { activeSuggestion, setActiveSuggestion } = useCodeEditor();
  const { user: currentUser } = useUser();
  const { project } = useProject();

  const isOwner = Boolean(project?.users?.[0] && String(project.users[0]?._id || project.users[0]) === String(currentUser?._id));

  const handleShowFiles = useCallback(() => {
    setShowFiles(true);
  }, [setShowFiles]);

  const handleSelectTab = useCallback(
    (tab) => {
      setActiveTab(tab);
    },
    [setActiveTab],
  );

  const handleRun = useCallback(() => {
    if (!isRunning) onRun();
  }, [isRunning, onRun]);

  const isPreviewDisabled = !iframeUrl || isRunning;
  const activeCollaborators = editorPresence.filter(
    (presence) => presence.filePath === activeFile,
  );

  return (
    <div className="h-[52px] flex items-center justify-between bg-[#090d16]/95 border-b border-slate-800/80 px-2 shrink-0 select-none backdrop-blur-2xl font-sans">
      {/* Mobile folder menu button */}
      <button
        onClick={handleShowFiles}
        aria-label="Open file explorer"
        className="md:hidden mr-1.5 px-2.5 py-1.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 transition cursor-pointer flex items-center gap-1.5 shrink-0"
      >
        <Folder size={15} />
        <span className="text-xs font-semibold">Files</span>
      </button>

      {/* File Tabs Container */}
      <div className="flex items-center gap-1.5 flex-1 overflow-x-auto hide-scrollbar py-1">
        {activeSuggestion && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/20 text-purple-200 border border-purple-400/50 shadow-md shadow-purple-950/40 text-xs font-bold shrink-0">
            <Sparkles size={13} className="text-purple-400 animate-pulse" />
            <span>⚡ AI Code Review</span>
            <button
              type="button"
              onClick={() => setActiveSuggestion(null)}
              className="p-0.5 rounded text-purple-400 hover:text-white hover:bg-purple-900/50 transition ml-1 cursor-pointer"
              title="Close review"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {openFiles.map((file) => {
          const collaborators = editorPresence.filter(
            (presence) => presence.filePath === file,
          );
          return (
            <FileTab
              key={file}
              fileName={file}
              isActive={activeFile === file}
              isDirty={modifiedFiles[file] !== undefined}
              disabled={activeTab === "preview"}
              collaborators={collaborators}
              onClick={onSelect}
              onClose={onClose}
            />
          );
        })}
      </div>

      {/* Behind Main & Discard Actions */}
      <div className="flex items-center gap-1.5 mr-1 shrink-0">
        {isBehindMain && (
          <button
            type="button"
            onClick={onSyncMain}
            title="Your draft is behind the latest Main branch. Click to pull latest code!"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30 transition cursor-pointer shadow-lg shadow-amber-500/10 animate-pulse"
          >
            <RefreshCw size={13} className="animate-spin text-amber-400" />
            <span>Sync Main</span>
          </button>
        )}

        {hasLocalDraft && (
          <button
            type="button"
            onClick={onDiscardDraft}
            title="Discard local unsubmitted draft and revert to Main"
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition cursor-pointer"
          >
            <Trash2 size={12} />
            <span className="hidden lg:inline">Discard Draft</span>
          </button>
        )}
      </div>

      {/* Git-Style PR / Code Review Button */}
      {onOpenPRModal && (
        <button
          type="button"
          onClick={onOpenPRModal}
          title={isOwner ? "Review & Merge Collaborator PRs" : "Propose Code Changes to Owner"}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer shrink-0 mr-2 ${
            isOwner
              ? pendingPRs.length > 0
                ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-500/10 animate-pulse"
                : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
              : "bg-indigo-600/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-600/30 shadow-md"
          }`}
        >
          <GitPullRequest size={14} className={isOwner && pendingPRs.length > 0 ? "text-amber-400" : "text-indigo-400"} />
          <span>{isOwner ? `PRs (${pendingPRs.length})` : "Propose PR"}</span>
        </button>
      )}

      {/* Code / Architecture / Preview Switcher */}
      <div className="flex items-center p-1 bg-slate-950/80 border border-slate-800/90 rounded-xl mx-1 shrink-0">
        <button
          onClick={() => handleSelectTab("code")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "code"
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Code2 size={13} />
          <span>Code</span>
        </button>

        <button
          onClick={() => handleSelectTab("architecture")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "architecture"
              ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Network size={13} />
          <span>Architecture</span>
        </button>

        <button
          disabled={isPreviewDisabled}
          onClick={() => !isPreviewDisabled && handleSelectTab("preview")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "preview"
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm"
              : isPreviewDisabled
              ? "text-slate-600 cursor-not-allowed opacity-40"
              : "text-slate-400 hover:text-slate-200 cursor-pointer"
          }`}
        >
          <Eye size={13} />
          <span>Preview</span>
        </button>
      </div>

      {/* Run WebContainer Button */}
      <button
        onClick={handleRun}
        disabled={isRunning}
        aria-label="Run project"
        className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-lg shrink-0 cursor-pointer ${
          isRunning
            ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-50"
            : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white border border-emerald-500/50 shadow-emerald-600/20 active:scale-95"
        }`}
      >
        {isRunning ? (
          <>
            <Loader2 className="animate-spin" size={14} />
            <span className="hidden md:inline">Starting...</span>
          </>
        ) : (
          <>
            <Play size={13} fill="currentColor" />
            <span className="hidden md:inline">Run</span>
          </>
        )}
      </button>
    </div>
  );
};

export default memo(TabsBar);
