import { motion } from "framer-motion";
import { Folder, Users, ArrowRight } from "lucide-react";

// cards animation
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

const ProjectCard = ({ project, onOpen }) => (
  <motion.div
    variants={itemVariants}
    onClick={onOpen}
    className="bg-gray-800/70 p-6 rounded-2xl cursor-pointer border border-gray-700 hover:border-blue-500 transition hover:-translate-y-2 group"
  >
    <div className="flex items-center gap-3 mb-3">
      {/* folder icon */}
      <Folder className="text-blue-400" size={24} />
      {/* folder name */}
      <h2 className="text-xl font-semibold truncate">{project.name}</h2>
    </div>

    <div className="flex items-center gap-2 text-gray-400 text-sm mb-5">
      {/* user icon */}
      <Users size={16} />
      {/* numbers of user in project */}
      <span>{project.users.length} member(s)</span>
    </div>

    {/* open project */}
    <div className="flex justify-between items-center text-sm">
      <span className="text-blue-400">Open Project</span>
      <ArrowRight
        size={18}
        className="text-gray-500 group-hover:text-blue-400 transition"
      />
    </div>
  </motion.div>
);

export default ProjectCard;
