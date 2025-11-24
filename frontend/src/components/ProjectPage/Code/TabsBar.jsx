import { Play, Loader2 } from "lucide-react";
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
}) => {
  return (
    <div className="flex items-center justify-between bg-gray-900/50 border-b border-gray-700">
      <div className="flex gap-2 flex-grow overflow-x-auto">

        {/* file tabs */}
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

      <div className="flex items-center bg-gray-800/60 border border-gray-700 rounded-full mx-3 overflow-hidden">

      {/* code button */}
        <button
          onClick={() => setActiveTab("code")}
          className={`px-4 py-1.5 ${
            activeTab === "code"
              ? "bg-gray-700 text-white"
              : "text-gray-400 cursor-pointer"
          }`}
        >
          Code
        </button>

        {/* preview button */}
        <button
          disabled={!iframeUrl || isRunning}
          onClick={() => iframeUrl && setActiveTab("preview")}
          className={`
    px-4 py-1.5 transition
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
        className={`px-4 py-1.5 m-2 flex items-center gap-1.5 w-[80px] rounded-md 
        ${
          isRunning
            ? "bg-gray-600 text-gray-300"
            : "bg-green-600 hover:bg-green-700 text-white cursor-pointer select-none"
        }
        `}
      >
        {isRunning ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <>
            <Play size={16} fill="white" /> Run
          </>
        )}
      </button>
    </div>
  );
};

export default TabsBar;
