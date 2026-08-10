import { memo, useCallback } from "react";
import { Trash2 } from "lucide-react";

const CollaboratorsRemoveModal = ({
  confirmRemove,
  setConfirmRemove,
  handleConfirmRemove,
  removeCollaborator,
}) => {
  const handleCancel = useCallback(() => {
    setConfirmRemove({ show: false, userId: null, username: "" });
  }, [setConfirmRemove]);

  const onConfirm = handleConfirmRemove || removeCollaborator;

  if (!confirmRemove?.show) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn font-sans"
      onClick={handleCancel}
    >
      <div
        className="bg-[#0c101d] rounded-2xl w-full max-w-sm p-6 border border-slate-800 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3 shadow-lg shadow-rose-500/10">
            <Trash2 size={24} />
          </div>

          <h3 className="text-lg font-bold text-white mb-1">
            Remove Collaborator
          </h3>

          <p className="text-xs text-slate-400 mb-4 leading-relaxed font-sans">
            Are you sure you want to remove{" "}
            <strong className="text-rose-400 font-semibold">{confirmRemove.username}</strong>{" "}
            from this project? They will lose access immediately.
          </p>

          <div className="flex items-center justify-end gap-3 w-full pt-1">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-2 px-4 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 py-2 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition shadow-lg shadow-rose-600/20 cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CollaboratorsRemoveModal);