import { memo, useCallback } from "react";
import { Play, Loader2, Folder, Code2, Eye, PanelLeftOpen } from "lucide-react";
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
}) => {
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

  return (
    <div className="h-[52px] flex items-center justify-between bg-[#090d16]/95 border-b border-slate-800/80 px-2 shrink-0 select-none backdrop-blur-2xl">
      {/* Mobile folder menu button */}
      <button
        onClick={handleShowFiles}
        aria-label="Open file explorer"
        className="md:hidden mr-2 p-2 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 transition cursor-pointer"
      >
        <Folder size={18} />
      </button>



      {/* File Tabs Container */}
      <div className="flex items-center gap-1.5 flex-1 overflow-x-auto hide-scrollbar py-1">
        {openFiles.map((file) => (
          <FileTab
            key={file}
            fileName={file}
            isActive={activeFile === file}
            disabled={activeTab === "preview"}
            onClick={onSelect}
            onClose={onClose}
          />
        ))}
      </div>

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