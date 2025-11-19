import { X } from "lucide-react";

const FileTab = ({ fileName, isActive, onClick, onClose, disabled }) => {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`px-3 py-1 flex items-center gap-2 rounded-t-md select-none
        ${isActive ? "bg-gray-800 text-white" : "bg-gray-900 text-gray-300"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-700"}
      `}
    >
      <span>{fileName.split("/").pop()}</span>

      {/* X should display but NOT work in preview mode */}
      <X
        size={14}
        className={`${disabled ? "text-gray-500" : "hover:text-red-400 cursor-pointer"}`}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) onClose();      // <-- IMPORTANT
        }}
      />
    </div>
  );
};

export default FileTab;