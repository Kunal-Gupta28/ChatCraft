import { X } from "lucide-react";

const FileTab = ({ fileName, isActive, onClick, onClose, disabled }) => {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`hidden md:flex px-3 py-1 rounded-t-md items-center gap-2 select-none
        ${
          isActive
            ? "bg-gray-800 text-white"
            : "bg-gray-900 text-gray-300 hover:bg-gray-700 cursor-pointer"
        }
        ${disabled && "pointer-events-none opacity-40"}
      `}
    >

      {/* tabs name */}
      <span className="truncate max-w-[120px]">
        {fileName.split("/").pop()}
      </span>

      {/* close button */}
      <X
        size={14}
        className={`${
          disabled ? "text-gray-500" : "hover:text-red-400 cursor-pointer"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) onClose();
        }}
      />
    </div>
  );
};

export default FileTab;
