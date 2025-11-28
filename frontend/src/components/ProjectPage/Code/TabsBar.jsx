import { Play, Loader2, Folder } from "lucide-react";
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
}) => {
  return (
    <div className="h-[55px] flex items-center justify-between bg-gray-900/50 border-b border-gray-700">
      {/* Folder icon for visible for mobile and tablet */}
      <button
        onClick={() => setShowFiles(true)}
        className="md:hidden ml-2 h-[80%] w-[40px] flex items-center justify-center
        bg-gray-700/80 hover:bg-gray-600 text-gray-200 border border-gray-600
        rounded-lg transition"
      >
        <Folder size={18} />
      </button>

      {/* file tabs */}
      <div className="flex gap-2 flex-grow overflow-x-auto px-2">
        {openFiles.map((file) => (
          <FileTab
            key={file}
            fileName={file}
            isActive={activeFile === file}
            disabled={activeTab === "preview"}
            onClick={() => onSelect(file)}
            onClose={() => onClose(file)}
          />
        ))}
      </div>

      {/* code and preview button*/}
      <div className="flex items-center justify-center h-[80%] bg-gray-800/60 border border-gray-700 rounded-full mx-3 overflow-hidden">
        <button
          onClick={() => setActiveTab("code")}
          className={`px-4 py-2.5 ${
            activeTab === "code" ? "bg-gray-700 text-white" : "text-gray-400"
          }`}
        >
          Code
        </button>

        <button
          disabled={!iframeUrl || isRunning}
          onClick={() => iframeUrl && setActiveTab("preview")}
          className={`px-4 py-2.5 transition
            ${
              activeTab === "preview"
                ? "bg-gray-700 text-white"
                : !iframeUrl || isRunning
                ? "text-gray-500 cursor-not-allowed opacity-40"
                : "text-gray-400 hover:text-gray-200 cursor-pointer"
            }
          `}
        >
          Preview
        </button>
      </div>

      {/* run button */}
      <button
        onClick={onRun}
        disabled={isRunning}
        className={`m-2 flex items-center justify-center gap-1.5 w-[40px] md:w-[80px] h-[80%] rounded-md 
          ${
            isRunning
              ? "bg-gray-600 text-gray-300"
              : "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
          }
        `}
      >
        {isRunning ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <>
            <Play size={16} fill="white" />{" "}
            <span className="hidden md:block">Run</span>
          </>
        )}
      </button>
    </div>
  );
};

export default TabsBar;
