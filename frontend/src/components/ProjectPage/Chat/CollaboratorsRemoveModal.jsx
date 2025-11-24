import { Trash2 } from "lucide-react";

const CollaboratorsRemoveModal = ({
  confirmRemove,
  setConfirmRemove,
  handleConfirmRemove,
}) => {
  return (
    <>
      {/* Remove Collaborator Confirmation Modal */}
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center animate-fadeIn select-none">

        <div className="bg-gray-900/95 rounded-2xl w-[90%] max-w-sm p-6 border border-gray-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] animate-slideUp">

          <div className="flex flex-col items-center">

            {/* trash icon */}
            <Trash2 size={40} className="text-red-500 mb-4" />

            {/* heading  */}
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              Remove Collaborator
            </h3>

            {/* paragraph */}
            <p className="text-center text-gray-400 mb-6">
              Are you sure, you want to remove{" "}
              <strong className="text-red-400">{confirmRemove.username}</strong>{" "}
              from this project? They will lose access immediately.
            </p>

            <div className="flex gap-4 w-full">

              {/* cancel button */}
              <button
                onClick={() =>
                  setConfirmRemove({ show: false, userId: null, username: "" })
                }
                className="flex-1 py-2 rounded-lg text-gray-200 border border-gray-700 hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
              >
                Cancel
              </button>

              {/* remove button */}
              <button
                onClick={handleConfirmRemove}
                className="flex-1 py-2 rounded-lg font-semibold bg-red-600 hover:bg-red-700 transition-colors duration-200 cursor-pointer"
              >
                Remove
              </button>

            </div>

          </div>
        </div>

      </div>
    </>
  );
};

export default CollaboratorsRemoveModal;
