import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from "react";
import { motion } from "framer-motion";
import axiosInstance from "../config/axios";
import { useUser } from "../contexts/user.context";

import BackgroundBlobs from "../components/BackgroundBlobs";
import Header from "../components/HomePage/Header";
import SearchBar from "../components/HomePage/SearchBar";
import ProjectList from "../components/HomePage/ProjectList";
import CreateProjectModal from "../components/HomePage/CreateProjectModal";
import SuccessToast from "../components/HomePage/SuccessToast";
import DeleteConfirmation from "../components/HomePage/DeleteConfirmation";
import RenameProjectPopup from "../components/HomePage/RenameProjectPopup";

// lazy loaded components
const AvatarPicker = lazy(() => import("../components/HomePage/AvatarPicker"));

const Home = () => {
  // context api
  const { user, setUser } = useUser();

  // state variables
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [allProject, setAllProject] = useState([]);
  const [showAvatarPopup, setShowAvatarPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState({
    open: false,
    projectId: null,
  });
  const [renamePopup, setRenamePopup] = useState({
    open: false,
    projectId: null,
  });

  // reload user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosInstance.get("/getMe");
        setUser(data.user);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);

  // fetching all projects and save it in allProject
  const fetchAllProjects = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/project/all");
      setAllProject(data.allProject);
    } catch (err) {
      console.log(err);
    }
  }, []);

  // whenever user's values changes fetch the all project data
  useEffect(() => {
    if (user) fetchAllProjects();
  }, [user, fetchAllProjects]);

  // create project
  const handleCreateProject = useCallback(async () => {
    if (!projectName.trim()) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await axiosInstance.post("/project/create", {
        name: projectName,
      });

      console.log(res.data)
      if (res.status === 201) {
        setSuccess(true);
        setShowPopup(false);
        setProjectName("");
        fetchAllProjects();

        setTimeout(() => setSuccess(false), 2500);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [projectName, fetchAllProjects]);

  // rename the project
  const handleReanameProject = useCallback(
    async (projectId, newName) => {
      try {
        const response = await axiosInstance.put("/project/rename", {
          projectId,
          newName,
        });

        if (response.status === 200) {
          fetchAllProjects();
        }
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      }
    },
    [fetchAllProjects],
  );

  // delete protect
  const handleDeleteProject = useCallback(async (projectId) => {
    try {
      const response = await axiosInstance.delete(
        `/project/delete/${projectId}`,
      );
      if (response.status === 200) {
        setAllProject(response.data.updatedProjectList);
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    }
  }, []);

  // filter project by input
  const filteredProjects = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return allProject.filter((p) => p.name.toLowerCase().includes(term));
  }, [allProject, searchTerm]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-[100dvh] lg:min-h-[100dvh] bg-gray-950 text-white px-2 lg:px-6 py-5 lg:py-10 relative overflow-hidden select-none"
    >
      {/* background Blobs */}
      <BackgroundBlobs />

      {/* header */}
      <Header
        setShowPopup={setShowPopup}
        setShowAvatarPopup={setShowAvatarPopup}
      />

      {/* SearchBar */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* ProjectList */}
      <ProjectList
        filteredProjects={filteredProjects}
        openDeletePopup={setDeletePopup}
        openRenamePopup={setRenamePopup}
      />

      {/* Create Project */}
      <CreateProjectModal
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        projectName={projectName}
        setProjectName={setProjectName}
        handleCreateProject={handleCreateProject}
        loading={loading}
        error={error}
        setError={setError}
      />

      {/* pops */}
      <Suspense fallback={null}>
        {showAvatarPopup && (
          <AvatarPicker
            open={showAvatarPopup}
            onClose={() => setShowAvatarPopup(false)}
          />
        )}
      </Suspense>

      {/* Rename Project Popup */}
      <RenameProjectPopup
        open={renamePopup.open}
        onClose={() => setRenamePopup({ open: false, projectId: null })}
        onConfirm={(name) => {
          handleReanameProject(renamePopup.projectId, name);
          setRenamePopup({ open: false, projectId: null });
        }}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmation
        open={deletePopup.open}
        onClose={() => setDeletePopup({ open: false, projectId: null })}
        onConfirm={() => {
          handleDeleteProject(deletePopup.projectId);
          setDeletePopup({ open: false, projectId: null });
        }}
      />

      {/* SuccessToast */}
      <SuccessToast success={success} />
    </motion.div>
  );
};

export default Home;
