import { getFileIcon, getFolderIcon } from "./fileIcons";

const InlineInput = ({ type, value, onChange, onCommit, onCancel, placeholder }) => (
  <div className="flex w-full items-center gap-1.5 px-2 py-0.5 font-mono text-xs select-none">
    {type === "folder" ? getFolderIcon(value, true) : getFileIcon(value)}
    <input
      type="text"
      autoFocus
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onCommit();
        if (e.key === "Escape") onCancel();
      }}
      onBlur={onCommit}
      className="w-full bg-[#111625] border border-blue-500/80 rounded px-1.5 py-0.5 text-white focus:outline-none font-mono text-xs shadow-inner"
    />
  </div>
);

export default InlineInput;
