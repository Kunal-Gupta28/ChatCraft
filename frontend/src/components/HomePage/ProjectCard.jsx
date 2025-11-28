import { motion } from "framer-motion";
import {
  Folder,
  Users,
  ArrowRight,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState, useRef } from "react";
import { useUser } from "../../contexts/user.context";
import { useProject } from "../../contexts/project.context";

// cards animation
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

const ProjectCard = ({ project, onOpen, onDelete, onRename }) => {
  const { user } = useUser();
  const { setProject } = useProject();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  return (
    <motion.div
      variants={itemVariants}
      // open project only when menu is not open
      onClick={() => {
        if (!menuOpen) onOpen();
      }}
      className="bg-gray-800/40 h-[160px] backdrop-blur-xl p-6 rounded-2xl cursor-pointer border border-gray-700/60 hover:border-blue-500/60 transition-all hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-500/10 group relative"
    >
      {/* top row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* folder icon */}
          <Folder className="text-blue-400 drop-shadow" size={26} />

          {/* folder name */}
          <h2 className="text-xl font-semibold truncate tracking-wide">
            {project.name}
          </h2>
        </div>

        {/* three dots button (only owner can see this) */}
        {project.owner === user?._id ? (
          <div
            className="relative w-8 h-8 flex justify-center items-center rounded-full cursor-pointer"
            ref={menuRef}
            onClick={(e) => {
              e.stopPropagation(); 
              setProject(project);
            }}
          >
            <MoreVertical
              size={20}
              className="text-gray-400 hover:text-white transition cursor-pointer"
              onClick={() => setMenuOpen((prev) => !prev)}
            />

            {/* rename and delete button */}
            {menuOpen && (
              <>
                {/* backdrop to close menu on outside click without navigating */}
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setMenuOpen(false)}
                ></div>

                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 mt-2 z-40 bg-[#0d0d0d] border border-[#1f1f1f] shadow-2xl shadow-black/60 rounded-2xl"
                >
                  {/* rename button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onRename();
                    }}
                    className="flex items-center gap-3 w-full px-8 py-2.5 text-sm hover:bg-[#1a1a1a] transition text-gray-200 cursor-pointer"
                  >
                    <Pencil size={15} className="text-gray-400" />
                    Rename
                  </button>

                  {/* delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onDelete();
                    }}
                    className="flex items-center gap-3 w-full px-8 py-2.5 text-sm hover:bg-[#2a0f0f] transition text-red-400 cursor-pointer"
                  >
                    <Trash2 size={15} className="text-red-400" />
                    Delete
                  </button>
                </motion.div>
              </>
            )}
          </div>
        ) : null}
      </div>

      {/* user icon and number of members in project*/}
      <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
        <Users size={16} className="opacity-80" />
        <span className="tracking-wide">{project.users.length} member(s)</span>
      </div>

      {/* open project */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-blue-400 font-medium tracking-wide">
          Open Project
        </span>
        <ArrowRight
          size={18}
          className="text-gray-500 group-hover:text-blue-400 transition"
        />
      </div>
    </motion.div>
  );
};

export default ProjectCard;
