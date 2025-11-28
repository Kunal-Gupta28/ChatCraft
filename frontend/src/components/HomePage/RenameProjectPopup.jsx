import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useProject } from "../../contexts/project.context";

const RenameProjectPopup = ({ open, onClose, onConfirm }) => {
  const { project } = useProject();
  const projectName = project?.name || "";
  const [inputValue, setInputValue] = useState(projectName);
const inputRef = useRef(null);

  // input filed default value
  useEffect(() => {
    if (open) {
      setInputValue(projectName);
    }
  }, [open, projectName]);

  useEffect(() => {
  if (open) {
    // select text after the input is rendered
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.select();
      }
    }, 0);
  }
}, [open]);


  const isDisabled =
    !inputValue.trim() || inputValue.trim() === projectName.trim();

  return (
    <AnimatePresence>
      {open && (
            <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-40"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 p-6 rounded-2xl w-[90%] max-w-md border border-gray-700"
      >

        {/* heading */}
        <h2 className="text-xl font-semibold mb-4">Rename Project</h2>

        {/* input filed */}
        <input
          autoFocus
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter new project name"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-blue-500 mb-5"
        />

        <div className="flex justify-end gap-3">

          {/* cancel button */}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            Cancel
          </button>

          {/* save button */}
          <button
            disabled={isDisabled}
            onClick={() => {
              onConfirm(inputValue.trim());
            }}
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
      )}
    </AnimatePresence>
  );
};

export default RenameProjectPopup;
