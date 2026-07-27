import { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../config/axios";
import { useUser } from "../contexts/user.context";

// component import
import BackgroundBlobs from "../components/BackgroundBlobs";
import Header from "../components/HomePage/Header";
import SearchBar from "../components/SearchBar";
import SortDropdown from "../components/HomePage/SortDropdown";
import StatsSidebar from "../components/HomePage/StatsSidebar";
import ProjectList from "../components/HomePage/ProjectList";
import CreatePopup from "../components/HomePage/CreatePopup";
import SuccessToast from "../components/SuccessToast";
import DeleteConfirmation from "../components/HomePage/DeleteConfirmation";
import RenamePopup from "../components/HomePage/RenamePopup";

// lazy loaded components
const AvatarPicker = lazy(() => import("../components/HomePage/AvatarPicker"));

const Home = () => {
  const queryClient = useQueryClient();
  // context api
  const { setUser } = useUser();

  // state variables
  const [toastMessage, setToastMessage] = useState("");
  const [projectName, setProjectName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date-newest");
  const [createPopup, setCreatePopup] = useState(false);
  const [avatarPopup, setAvatarPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState({
    open: false,
    projectId: null,
    projectName: "",
  });
  const [renamePopup, setRenamePopup] = useState({
    open: false,
    projectId: null,
    projectName: "",
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
    createMutation.mutate(projectName);
  };

  const createMutation = useMutation({
    mutationFn: (projectName) =>
      axiosInstance.post("/project/create", { projectName }),

    onSuccess: (res) => {
      queryClient.setQueryData(["projects"], (old = []) => [
        ...old,
        res.data.data,
      ]);

      setCreatePopup(false);
      setProjectName("");
      showSuccess("Project created successfully");
    },
  });

  // rename the project
  const handleRenameProject = (projectId, newProjectName) => {
    renameMutation.mutate({ projectId, newProjectName });
  };

  const renameMutation = useMutation({
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
      setRenamePopup({ open: false, projectId: null, projectName: "" });
      showSuccess("Project renamed successfully");
    },
  });

  // delete project
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
  });

  // filter and sort projects
  const filteredProjects = useMemo(() => {
    const term = searchTerm.toLowerCase();

    let list = projects
      .filter((p) => p?.projectName)
      .filter((p) => p.projectName.toLowerCase().includes(term));

    return list.sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.projectName.localeCompare(b.projectName);
      }
      if (sortBy === "name-desc") {
        return b.projectName.localeCompare(a.projectName);
      }
      if (sortBy === "date-newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (sortBy === "date-oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      if (sortBy === "members-desc") {
        const countA = a.memberCount ?? a.users?.length ?? 0;
        const countB = b.memberCount ?? b.users?.length ?? 0;
        return countB - countA;
      }
      if (sortBy === "members-asc") {
        const countA = a.memberCount ?? a.users?.length ?? 0;
        const countB = b.memberCount ?? b.users?.length ?? 0;
        return countA - countB;
      }
      return 0;
    });
  }, [projects, searchTerm, sortBy]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-[100dvh] bg-gray-950 text-white px-3 sm:px-6 py-4 sm:py-6 relative overflow-hidden select-none flex flex-col"
    >
      {/* background Blobs */}
      <BackgroundBlobs />

      <div className="w-full max-w-[92vw] 2xl:max-w-[88vw] mx-auto flex flex-col h-full relative z-10">
        {/* header */}
        <Header setCreatePopup={setCreatePopup} setAvatarPopup={setAvatarPopup} />

        {/* 2-Column Content Layout */}
        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 relative z-20">
          {/* Left Sidebar: Workspace Statistics */}
          <StatsSidebar projects={projects} />

          {/* Right Panel: Search, Sort & Project List */}
          <main className="flex-1 flex flex-col min-w-0 h-full relative">
            {/* SearchBar & Sort Controls */}
            <div className="flex items-center gap-3 mb-4 relative z-30 shrink-0">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search projects by name..."
              />
              <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
            </div>

            {/* ProjectList */}
            <div className="flex-1 min-h-0 relative">
              <ProjectList
                filteredProjects={filteredProjects}
                openDeletePopup={setDeletePopup}
                openRenamePopup={setRenamePopup}
              />
            </div>
          </main>
        </div>
      </div>

      {/* Create Project */}
      <CreatePopup
        createPopup={createPopup}
        setCreatePopup={setCreatePopup}
        projectName={projectName}
        setProjectName={setProjectName}
        handleCreateProject={handleCreateProject}
        createMutation={createMutation}
      />

      {/* Avatar pops */}
      <Suspense fallback={null}>
        {avatarPopup && (
          <AvatarPicker
            open={avatarPopup}
            onClose={() => setAvatarPopup(false)}
          />
        )}
      </Suspense>

      {/* Rename Project Popup */}
      <RenamePopup
        renamePopup={renamePopup}
        onClose={() => {
          (renameMutation.reset(),
            setRenamePopup({ open: false, projectId: null, projectName: "" }));
        }}
        onConfirm={(newName) => {
          handleRenameProject(renamePopup.projectId, newName);
        }}
        renameMutation={renameMutation}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmation
        open={deletePopup.open}
        projectName={deletePopup.projectName}
        loading={deleteProjectMutation.isPending}
        onClose={() => {
          (deleteProjectMutation.reset(),
            setDeletePopup({ open: false, projectId: null, projectName: "" }));
        }}
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
