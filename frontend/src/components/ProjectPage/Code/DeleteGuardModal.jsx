import { AlertTriangle } from "lucide-react";

const DeleteGuardModal = ({ deletingPath, onClose, onConfirm }) => {
  if (!deletingPath) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none font-sans" onClick={onClose}>
      <div className="w-full max-w-xs bg-[#0c101d] border border-slate-800 rounded-xl p-4 shadow-2xl space-y-3 font-mono text-xs" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 text-rose-400 font-bold border-b border-slate-800 pb-2">
          <AlertTriangle size={15} />
          <span>Confirm Deletion</span>
        </div>
        <p className="text-slate-300 font-sans text-xs">
          Are you sure you want to delete <strong className="text-white font-mono">{deletingPath}</strong>?
        </p>
        <div className="flex items-center justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteGuardModal;
