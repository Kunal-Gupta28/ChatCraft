import { useState, useEffect, useRef, useLayoutEffect, memo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useProject } from "../../contexts/project.context";

// animation variants outside component (avoid re-creation)
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

const RenameProjectPopup = ({ open, onClose, onConfirm }) => {
  const { project } = useProject();
  const projectName = project?.name || "";

  const [inputValue, setInputValue] = useState(projectName);
  const inputRef = useRef(null);

  // sync input when popup opens
  useEffect(() => {
    if (open) setInputValue(projectName);
  }, [open, projectName]);

  // select input text without setTimeout
  useLayoutEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.select();
    }
  }, [open]);

  const handleChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  const handleConfirm = useCallback(() => {
    onConfirm(inputValue.trim());
  }, [inputValue, onConfirm]);

  const trimmed = inputValue.trim();
  const isDisabled = !trimmed || trimmed === projectName.trim();

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
          <h2 className="text-xl font-semibold mb-4">Rename Project</h2>

          <input
            autoFocus
            ref={inputRef}
            value={inputValue}
            onChange={handleChange}
            placeholder="Enter new project name"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-blue-500 mb-5"
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Cancel
            </button>

            <button
              disabled={isDisabled}
              onClick={handleConfirm}
              className={`px-4 py-2 rounded-lg transition ${
                isDisabled
                  ? "bg-blue-600/40 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500"
              }`}
            >
              Save
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default memo(RenameProjectPopup);
