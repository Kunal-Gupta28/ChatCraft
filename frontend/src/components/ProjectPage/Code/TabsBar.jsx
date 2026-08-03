import { memo, useCallback } from "react";
import { Play, Loader2, Folder, Code2, Eye, Sparkles, X } from "lucide-react";
import { useCodeEditor } from "../../../contexts/codeEditor.context";
import FileTab from "./FileTab";

const TabsBar = ({
  openFiles,
  activeFile,
  onSelect,
  onClose,
  activeTab,
  setActiveTab,
  iframeUrl,
  isRunning,
  onRun,
  setShowFiles,
  toggleChat,
  isChatVisible,
  editorPresence = [],
}) => {
  const { activeSuggestion, setActiveSuggestion } = useCodeEditor();

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
    <div className="h-[52px] flex items-center justify-between bg-[#090d16]/95 border-b border-slate-800/80 px-2 shrink-0 select-none backdrop-blur-2xl">
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
              disabled={activeTab === "preview"}
              collaborators={collaborators}
              onClick={onSelect}
              onClose={onClose}
            />
          );
        })}
      </div>

      {activeCollaborators.length > 0 && (
        <div className="hidden xl:flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950/70 px-2 py-1 text-[10px] text-slate-400 shrink-0">
          <span className="flex -space-x-1.5">
            {activeCollaborators.slice(0, 3).map((presence) => (
              <span
                key={presence.connectionId}
                title={`${presence.username} is editing ${activeFile}`}
                className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-950 text-[8px] font-bold text-slate-950"
                style={{ backgroundColor: ["#22d3ee", "#a78bfa", "#f59e0b", "#34d399", "#fb7185"][presence.colorIndex % 5] }}
              >
                {presence.username?.charAt(0)?.toUpperCase()}
              </span>
            ))}
          </span>
          <span>{activeCollaborators.map((presence) => presence.username).join(", ")} editing</span>
        </div>
      )}

      {/* Code / Preview Switcher */}
      <div className="flex items-center p-1 bg-slate-950/80 border border-slate-800/90 rounded-xl mx-2 shrink-0">
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
