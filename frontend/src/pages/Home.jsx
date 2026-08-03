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
    enabled: !!localStorage.getItem("token"),
  });

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData, setUser]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  // Reset to page 1 whenever user searches or changes sorting
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy]);

  // fetching paginated projects chunk from backend
  const fetchProjectsChunk = async () => {
    const { data } = await axiosInstance.get("/project/all", {
      params: {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        sortBy: sortBy,
      },
    });
    return data;
  };

  const { data: projectResponse } = useQuery({
    queryKey: ["projects", currentPage, itemsPerPage, searchTerm, sortBy],
    queryFn: fetchProjectsChunk,
    enabled: !!userData,
  });

  const projects = projectResponse?.allProject || [];
  const paginationMeta = projectResponse?.pagination || {
    totalProjects: 0,
    ownedCount: 0,
    sharedCount: 0,
    totalPages: 1,
    currentPage: 1,
    limit: itemsPerPage,
  };

  const totalItems = paginationMeta.totalProjects;
  const totalPages = Math.max(1, paginationMeta.totalPages);

  // create project
  const handleCreateProject = () => {
    if (!projectName.trim()) return;
    createMutation.mutate(projectName);
  };

  const createMutation = useMutation({
    mutationFn: (projectName) =>
      axiosInstance.post("/project/create", { projectName }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
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

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
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

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      showSuccess("Project deleted successfully");
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-[100dvh] md:h-[100dvh] bg-gray-950 text-white px-3 sm:px-6 py-4 sm:py-6 relative overflow-y-auto md:overflow-hidden select-none flex flex-col"
    >
      {/* background Blobs */}
      <BackgroundBlobs />

      <div className="w-full max-w-[96vw] md:max-w-[94vw] lg:max-w-[92vw] 2xl:max-w-[88vw] mx-auto flex flex-col h-full relative z-10">
        {/* header */}
        <Header setCreatePopup={setCreatePopup} setAvatarPopup={setAvatarPopup} />

        {/* 2-Column Content Layout */}
        <div className="flex flex-col md:flex-row gap-4 lg:gap-6 flex-1 min-h-0 relative z-20">
          {/* Left Sidebar: Workspace Statistics */}
          <StatsSidebar projects={projects} pagination={paginationMeta} />

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
                filteredProjects={projects}
                openDeletePopup={setDeletePopup}
                openRenamePopup={setRenamePopup}
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
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
