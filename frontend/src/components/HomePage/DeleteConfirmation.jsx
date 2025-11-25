import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useProject } from "../../contexts/project.context";

const DeleteConfirmation = ({ open, onClose, onConfirm }) => {
    const {project} = useProject();
    const projectName =project?.name;

  if (!open) return null;

  const [inputValue, setInputValue] = useState("");

  // reset input when popup opens/closes
  useEffect(() => {
    if (!open) setInputValue("");
  }, [open]);

  const isMatch = inputValue.trim() === projectName.trim();

  return (
    <motion.div
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-40"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 p-6 rounded-2xl w-[90%] max-w-md border border-gray-700"
      >
        <h2 className="text-xl font-semibold mb-4 text-red-400">
          Delete Project?
        </h2>

        <p className="text-gray-300 mb-3">
          This action cannot be undone.
        </p>

        <p className="text-gray-400 text-sm mb-4">
          To confirm, type the project name: 
          <span className="text-gray-200 font-semibold"> "{projectName}"</span>
        </p>

        {/* user must type project name here */}
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Type "${projectName}" to confirm`}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg outline-none text-gray-200 mb-6"
        />

        <div className="flex justify-end gap-3">

          {/* cancel button */}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            Cancel
          </button>

          {/* delete button */}
          <button
            onClick={isMatch ? onConfirm : null}
            disabled={!isMatch}
            className={`
              px-4 py-2 rounded-lg transition
              ${isMatch 
                ? "bg-red-600 hover:bg-red-500 cursor-pointer" 
                : "bg-red-600/40 cursor-not-allowed"}
            `}
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeleteConfirmation;
