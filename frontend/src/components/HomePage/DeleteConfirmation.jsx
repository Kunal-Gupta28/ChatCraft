import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback, memo } from "react";
import { useProject } from "../../contexts/project.context";

// animation variants outside component
const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
};

const DeleteConfirmation = ({ open, onClose, onConfirm }) => {
  const { project } = useProject();
  const projectName = project?.name || "";

  const [inputValue, setInputValue] = useState("");
  const deleteBtnRef = useRef(null);

  // reset input when popup closes
  useEffect(() => {
    if (!open) setInputValue("");
  }, [open]);

  const trimmed = inputValue.trim();
  const isMatch = projectName && trimmed === projectName.trim();

  // focus delete button when match
  useEffect(() => {
    if (isMatch && deleteBtnRef.current) {
      deleteBtnRef.current.focus();
    }
  }, [isMatch]);

  const handleChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  const handleConfirm = useCallback(() => {
    if (isMatch) onConfirm();
  }, [isMatch, onConfirm]);

  if (!open) return null; // early return optimization

  return (
    <AnimatePresence>
      <motion.div
        variants={backdropVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-40"
      >
        <motion.div
          variants={modalVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="bg-gray-900 p-6 rounded-2xl w-[90%] max-w-md border border-gray-700"
        >
          <h2 className="text-xl font-semibold mb-4 text-red-400">
            Delete Project?
          </h2>

          <p className="text-gray-300 mb-3">This action cannot be undone.</p>

          <p className="text-gray-400 text-sm mb-4">
            To confirm, type the project name:
            <span className="text-gray-200 font-semibold">
              {` "${projectName}"`}
            </span>
          </p>

          <input
            autoFocus
            value={inputValue}
            onChange={handleChange}
            placeholder={`Type "${projectName}" to confirm`}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-red-500 outline-none text-gray-200 mb-6"
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Cancel
            </button>

            <button
              ref={deleteBtnRef}
              onClick={handleConfirm}
              disabled={!isMatch}
              className={`
                px-4 py-2 rounded-lg transition
                ${
                  isMatch
                    ? "bg-red-600 hover:bg-red-500 cursor-pointer"
                    : "bg-red-600/40 cursor-not-allowed"
                }
              `}
            >
              Delete
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default memo(DeleteConfirmation);
