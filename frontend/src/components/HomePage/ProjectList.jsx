import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../../contexts/user.context";
import ProjectCard from "./ProjectCard";

// container animation
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
};

const ProjectList = ({
  filteredProjects,
  openDeletePopup,
  openRenamePopup,
}) => {
  const navigate = useNavigate();
  const { user } = useUser();

  // navigate to project
  const handleOpen = useCallback(
    (project) => {
      navigate(`/project/${project._id}`);
    },
    [navigate],
  );

  // delete popup
  const handleDelete = useCallback(
    (project) => {
      openDeletePopup({
        open: true,
        projectId: project._id,
        projectName: project.projectName,
      });
    },
    [openDeletePopup],
  );

  // rename popup
  const handleRename = useCallback(
    (project) => {
      openRenamePopup({ open: true, projectId: project._id, projectName: project.projectName });
    },
    [openRenamePopup],
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-full w-full overflow-y-auto hide-scrollbar pb-16 pt-1"
    >
      {/* show all projects if not present then show no project found paragraph */}
      <div className="gap-6 pb-8 project-grid">
        <AnimatePresence>
          {filteredProjects?.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                isOwner={project.owner === user?._id}
                onOpen={handleOpen}
                onDelete={handleDelete}
                onRename={handleRename}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full flex flex-col items-center justify-center py-24 text-gray-400 select-none"
            >
              <p className="text-base text-gray-400 font-medium">No projects found 🫤</p>
              <p className="text-xs text-gray-500 mt-1">Try refining your search or create a new project above.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default memo(ProjectList);
