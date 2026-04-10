import { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../config/axios";
import { useUser } from "../contexts/user.context";

import BackgroundBlobs from "../components/BackgroundBlobs";
import Header from "../components/HomePage/Header";
import SearchBar from "../components/SearchBar";
import ProjectList from "../components/HomePage/ProjectList";
import CreateProjectModal from "../components/HomePage/CreateProjectModal";
import SuccessToast from "../components/SuccessToast";
import DeleteConfirmation from "../components/HomePage/DeleteConfirmation";
import RenameProjectPopup from "../components/HomePage/RenameProjectPopup";

// lazy loaded components
const AvatarPicker = lazy(() => import("../components/HomePage/AvatarPicker"));

const Home = () => {
  const queryClient = useQueryClient();
  // context api
  const { setUser } = useUser();

  // state variables
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAvatarPopup, setShowAvatarPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState({
    open: false,
    projectId: null,
    projectName: "",
  });
  const [renamePopup, setRenamePopup] = useState({
    open: false,
    projectId: null,
  });
  const showSuccess = (msg) => setToastMessage(msg);

  // load user data
  const fetchUser = async () => {
    const { data } = await axiosInstance.get("/getMe");
    return data.user;
  };

  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData, setUser]);

  // fetching all projects and save it in project context
  const fetchAllProjects = async () => {
    const { data } = await axiosInstance.get("/project/all");
    return data.allProject;
  };

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchAllProjects,
    enabled: !!userData,
  });

  // create project
  const handleCreateProject = () => {
    if (!projectName.trim()) return;
    createProjectMutation.mutate(projectName);
  };

  const createProjectMutation = useMutation({
    mutationFn: (projectName) =>
      axiosInstance.post("/project/create", { projectName }),

    onSuccess: (res) => {
      queryClient.setQueryData(["projects"], (old = []) => [
        ...old,
        res.data.data,
      ]);

      setShowPopup(false);
      setProjectName("");
      showSuccess("Project created successfully");
    },

    onError: (err) => {
      setError(err.response?.data?.message || err.message);
    },
  });

  // rename the project
  const handleRenameProject = (projectId, newProjectName) => {
    renameProjectMutation.mutate({ projectId, newProjectName });
  };

  const renameProjectMutation = useMutation({
    mutationFn: ({ projectId, newProjectName }) =>
      axiosInstance.put("/project/rename", {
        projectId,
        newProjectName,
      }),

    onSuccess: (_, variables) => {
      queryClient.setQueryData(["projects"], (oldData) =>
        oldData?.map((p) =>
          p._id === variables.projectId
            ? { ...p, projectName: variables.newProjectName }
            : p,
        ),
      );

      showSuccess("Project renamed successfully");
    },

    onError: (error) => {
      setError(error.response?.data?.message || error.message);
    },
  });

  // delete protect
  const handleDeleteProject = (projectId) => {
    deleteProjectMutation.mutate(projectId);
  };

  const deleteProjectMutation = useMutation({
    mutationFn: (projectId) =>
      axiosInstance.delete(`/project/delete/${projectId}`),

    onSuccess: (_, projectId) => {
      // Update cache instantly (no refetch)
      queryClient.setQueryData(["projects"], (oldData) =>
        oldData?.filter((p) => p._id !== projectId),
      );

      showSuccess("Project deleted successfully");
    },

    onError: (error) => {
      setError(error.response?.data?.message || error.message);
    },
  });

  // filter project by input
  const filteredProjects = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return projects
      .filter((p) => p?.projectName)
      .filter((p) => p.projectName.toLowerCase().includes(term));
  }, [projects, searchTerm]);

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
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search projects by name..."
      />

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
        loading={createProjectMutation.isPending}
        error={error}
        setError={setError}
      />

      {/* Avatar pops */}
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
          handleRenameProject(renamePopup.projectId, name);
          setRenamePopup({ open: false, projectId: null });
        }}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmation
        open={deletePopup.open}
        projectName={deletePopup.projectName}
        loading={deleteProjectMutation.isPending}
        onClose={() =>
          setDeletePopup({ open: false, projectId: null, projectName: "" })
        }
        onConfirm={() => {
          handleDeleteProject(deletePopup.projectId);
          setDeletePopup({ open: false, projectId: null, projectName: "" });
        }}
      />

      {/* SuccessToast */}
      <SuccessToast
        message={toastMessage}
        clearToast={() => setToastMessage("")}
      />
    </motion.div>
  );
};

export default Home;
