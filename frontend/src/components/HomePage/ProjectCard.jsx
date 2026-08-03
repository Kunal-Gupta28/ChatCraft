import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Folder,
  Users,
  ArrowRight,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

// cards animation
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

const ProjectCard = ({ project, isOwner, onOpen, onDelete, onRename }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on click outside anywhere on the document
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [menuOpen]);

  // menu toggle
  const toggleMenu = useCallback((e) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  }, []);

  // open menu
  const handleOpen = useCallback(() => {
    if (!menuOpen) onOpen(project);
  }, [menuOpen, onOpen, project]);

  // rename handler
  const handleRename = useCallback(
    (e) => {
      e.stopPropagation();
      setMenuOpen(false);
      onRename(project);
    },
    [onRename, project],
  );

  // delete handler
  const handleDelete = useCallback(
    (e) => {
      e.stopPropagation();
      setMenuOpen(false);
      onDelete(project);
    },
    [onDelete, project],
  );

  return (
    <motion.div
      variants={itemVariants}
      onClick={handleOpen}
      className="bg-gray-800/40 min-h-[150px] md:h-[160px] backdrop-blur-xl p-4 sm:p-5 lg:p-6 rounded-2xl cursor-pointer border border-gray-700/60 hover:border-blue-500/60 transition-all hover:-translate-y-1.5 hover:shadow-lg hover:shadow-blue-500/10 group relative"
    >
      {/* top row */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* folder icon */}
          <Folder className="text-blue-400 drop-shadow shrink-0" size={26} />

          {/* folder name */}
          <h2 className="text-xl font-semibold truncate tracking-wide w-full text-white">
            {project.projectName}
          </h2>
        </div>

        {/* three dots button (only owner can see this) */}
        {isOwner ? (
          <div className="relative z-20" ref={menuRef}>
            <button
              type="button"
              aria-label="Project actions"
              onClick={toggleMenu}
              className="w-8 h-8 flex justify-center items-center rounded-xl hover:bg-gray-700/60 active:scale-95 transition cursor-pointer text-gray-400 hover:text-white"
            >
              <MoreVertical size={18} />
            </button>

            {/* rename and delete menu */}
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -4 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-full mt-1.5 z-50 bg-[#0b0f17] border border-slate-700/80 shadow-2xl shadow-black/90 rounded-xl py-1.5 min-w-[130px] overflow-hidden backdrop-blur-2xl ring-1 ring-white/10"
              >
                {/* rename button */}
                <button
                  type="button"
                  onClick={handleRename}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition cursor-pointer"
                >
                  <Pencil size={14} className="text-slate-400" />
                  Rename
                </button>

                {/* delete button */}
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/15 transition cursor-pointer"
                >
                  <Trash2 size={14} className="text-red-400" />
                  Delete
                </button>
              </motion.div>
            )}
          </div>
        ) : null}
      </div>

      {/* user icon and number of members in project */}
      <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
        <Users size={16} className="opacity-80" />
        <span className="tracking-wide">{project.memberCount} members</span>
      </div>

      {/* open project text + right arrow */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-blue-400 font-medium tracking-wide">
          Open Project
        </span>

        {/* right arrow symbol */}
        <ArrowRight
          size={18}
          className="text-gray-500 group-hover:text-blue-400 transition"
        />
      </div>
    </motion.div>
  );
};

export default React.memo(ProjectCard);
