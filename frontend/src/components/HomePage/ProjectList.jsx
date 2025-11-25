import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useProject } from "../../contexts/project.context";
import ProjectCard from "./ProjectCard";

// container animation
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const ProjectList = ({
  filteredProjects,
  openDeletePopup,
  openRenamePopup,
}) => {
  const {setProject} = useProject();
  const navigate = useNavigate();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-[85vw] mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 relative z-10"
    >
      {/* show all projects if not present then show no project found paragraph */}
      <AnimatePresence>
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onOpen={() => {
                setProject(project);
                navigate("/project");
              }}
              onDelete={() =>
                openDeletePopup({ open: true, projectId: project._id })
              }
              onRename={() =>
                openRenamePopup({ open: true, projectId: project._id })
              }
            />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-full text-center text-gray-400 mt-[25vh]"
          >
            <p>No projects found 🫤</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectList;
