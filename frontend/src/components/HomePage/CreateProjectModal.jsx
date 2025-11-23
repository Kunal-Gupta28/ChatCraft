import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";

const CreateProjectModal = ({
  showPopup,
  setShowPopup,
  projectName,
  setProjectName,
  handleCreateProject,
  loading,
  error,
  setError,
}) => {
  if (!showPopup) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-gray-900 p-8 rounded-2xl shadow-xl min-w-[400px] border border-gray-700 relative"
      >

        {/* close button */}
        <button
          onClick={() => {
            setShowPopup(false);
            setProjectName("");
            setError(null);
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
        >
          <X size={24} />
        </button>

        {/* heading */}
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mb-6">
          Create New Project
        </h3>

        {/* input field */}
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          onKeyDown={(event) => event.key === "Enter" && handleCreateProject()}
          placeholder="Enter project name"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg mb-5 outline-none text-white"
          disabled={loading}
          autoFocus
        />

        <div className="flex justify-end gap-3">
        {/* cancel button */}
          <button
            onClick={() => {
              setShowPopup(false);
              setProjectName("");
              setError(null);
            }}
            className="px-5 py-2 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600 transition"
            disabled={loading}
          >
            Cancel
          </button>

          {/* Create button */}
          <button
            onClick={handleCreateProject}
            disabled={loading || !projectName.trim()}
            className={`px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center gap-2 min-w-[110px] ${
              loading || !projectName.trim()
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-105 transition"
            }`}
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : "Create"}
          </button>
        </div>

        {/* show error if present */}
        {error && <p className="text-red-400 mt-4">{error}</p>}
      </motion.div>
    </motion.div>
  );
};

export default CreateProjectModal;
