import { memo } from "react";
import { X, FileCode } from "lucide-react";

const FileTab = ({ fileName, isActive, onClick, onClose, disabled }) => {
  const shortName = fileName.split("/").pop();

  return (
    <div
      onClick={!disabled ? () => onClick(fileName) : undefined}
      className={`flex px-3 py-1.5 rounded-lg items-center gap-2 select-none text-xs font-medium transition-all shrink-0
        ${
          isActive
            ? "bg-gray-800 text-white border border-gray-700 shadow-sm"
            : "bg-gray-900/60 text-gray-400 hover:bg-gray-800/60 hover:text-gray-200 cursor-pointer border border-transparent"
        }
        ${disabled && "pointer-events-none opacity-40"}
      `}
    >
      <FileCode size={13} className={isActive ? "text-blue-400" : "text-gray-500"} />

      <span className="truncate max-w-[130px]">
        {shortName}
      </span>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) onClose(fileName);
        }}
        className="p-0.5 rounded hover:bg-gray-700/80 hover:text-red-400 transition"
      >
        <X size={12} className={disabled ? "text-gray-600" : "text-gray-400"} />
      </button>
    </div>
  );
};

export default memo(FileTab);
