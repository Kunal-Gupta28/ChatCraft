import { useCallback } from "react";
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
  const { setProject } = useProject();
  const navigate = useNavigate();

  // navigate to project
  const handleOpen = useCallback(
    (project) => {
      setProject(project);
      navigate("/project");
    },
    [setProject, navigate]
  );

  // delete popup
  const handleDelete = useCallback(
    (projectId) => {
      openDeletePopup({ open: true, projectId });
    },
    [openDeletePopup]
  );

  // rename popup
  const handleRename = useCallback(
    (projectId) => {
      openRenamePopup({ open: true, projectId });
    },
    [openRenamePopup]
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-[82%] max-w-full lg:max-w-[85vw] px-[7.5%] lg:px-0 mx-auto relative overflow-scroll hide-scrollbar"
    >
      {/* show all projects if not present then show no project found paragraph */}
      <div className="gap-6 pt-4 pb-12 lg:pb-4 project-grid">
        <AnimatePresence>
          {filteredProjects?.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onOpen={() => handleOpen(project)}
                onDelete={() => handleDelete(project._id)}
                onRename={() => handleRename(project._id)}
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
      </div>
    </motion.div>
  );
};

export default ProjectList;
