import { useState, useCallback, useMemo } from "react";
import { ArrowLeft, UserPlus } from "lucide-react";
import axiosInstance from "../../../../config/axios";
import { useUser } from "../../../../contexts/user.context";
import { useProject } from "../../../../contexts/project.context";

import Header from "../Header";
import SearchBar from "../../../SearchBar";
import CollaboratorsList from "./CollaboratorsList";
import CollaboratorsAddModal from "./CollaboratorsAddModal";
import CollaboratorsRemoveModal from "./CollaboratorsRemoveModal";
import SuccessToast from "../../../SuccessToast";

const filterUsers = (users = [], query = "") => {
  const q = query.trim().toLowerCase();
  const validUsers = users.filter(Boolean).map((u) => {
    if (typeof u === "string") return { _id: u, username: "Member (" + u.slice(-4) + ")" };
    return u;
  });
  if (!q) return validUsers;
  return validUsers.filter(
    (u) =>
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
  );
};

const Collaborators = ({ setShowUsers }) => {
  const { project, setProject } = useProject();
  const { user: currentUser } = useUser();

  const [allUsers, setAllUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmRemove, setConfirmRemove] = useState({
    show: false,
    userId: null,
    username: "",
  });
  const [toastMessage, setToastMessage] = useState("");

  const ownerId = String(
    project?.owner?._id || project?.owner || project?.users?.[0]?._id || project?.users?.[0] || ""
  );
  const currentUserId = String(currentUser?._id || "");

  const isOwner = Boolean(
    ownerId && currentUserId && (ownerId === currentUserId || String(project?.users?.[0]?._id || project?.users?.[0]) === currentUserId)
  );

  const resetModalState = useCallback(() => {
    setShowModal(false);
    setSelectedUsers([]);
    setSearchQuery("");
  }, []);

  const fetchAllUsers = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/all");
      setAllUsers(res.data.allUsers || []);
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const selectedUsersHandler = useCallback(
    (user) => {
      const alreadyAdded = project?.users?.some((u) => String(u._id || u) === String(user._id));
      if (alreadyAdded) return;

      setSelectedUsers((prev) => {
        const exists = prev.some((u) => String(u._id) === String(user._id));
        return exists
          ? prev.filter((u) => String(u._id) !== String(user._id))
          : [...prev, user];
      });
    },
    [project?.users],
  );

  const refreshProject = useCallback(async () => {
    if (!project?._id) return;
    try {
      const response = await axiosInstance.get(`/project/get-project/${project._id}`);
      if (response.data?.project) {
        setProject(response.data.project);
      }
    } catch (err) {
      console.error("Failed to refresh project members:", err);
    }
  }, [project?._id, setProject]);

  const addCollaborator = useCallback(async () => {
    if (!selectedUsers.length) return;

    try {
      const res = await axiosInstance.put("/project/add-user", {
        projectId: project._id,
        users: selectedUsers.map((u) => u._id),
      });

      if (res.status === 200) {
        setToastMessage(`${selectedUsers.length} collaborator(s) added`);
        resetModalState();
        await refreshProject();
      }
    } catch (error) {
      console.error(error);
    }
  }, [selectedUsers, project?._id, resetModalState, refreshProject]);

  const removeCollaborator = useCallback(async () => {
    const { userId } = confirmRemove;
    if (!userId) return;

    try {
      const res = await axiosInstance.put("/project/remove-user", {
        projectId: project._id,
        userId,
      });

      if (res.status === 200) {
        setToastMessage(`${confirmRemove.username} removed from project`);
        setConfirmRemove({ show: false, userId: null, username: "" });
        await refreshProject();
      }
    } catch (error) {
      console.error(error);
    }
  }, [confirmRemove, project?._id, refreshProject]);

  const filteredProjectUsers = useMemo(
    () => filterUsers(project?.users || [], searchTerm),
    [project?.users, searchTerm]
  );

  const filteredAllUsers = useMemo(
    () => filterUsers(allUsers, searchQuery),
    [allUsers, searchQuery]
  );

  const headerRightActions = useMemo(() => {
    if (!isOwner) return [];
    return [
      {
        label: "Add Member",
        icon: <UserPlus size={13} />,
        onClick: fetchAllUsers,
        variant: "primary",
        title: "Add New Collaborator"
      }
    ];
  }, [isOwner, fetchAllUsers]);

  if (showModal) {
    return (
      <CollaboratorsAddModal
        filteredAllUsers={filteredAllUsers}
        selectedUsers={selectedUsers}
        selectedUsersHandler={selectedUsersHandler}
        addCollaborator={addCollaborator}
        setShowModal={setShowModal}
        setSelectedUsers={setSelectedUsers}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        projectUsers={project?.users}
        currentUserId={currentUserId}
      />
    );
  }

  const memberCount = (project?.users || []).length;

  return (
    <div className="w-full h-full flex flex-col bg-[#090d16]/95 backdrop-blur-2xl font-sans select-none">
      <Header
        title={`Project Members (${memberCount})`}
        leftIcon={<ArrowLeft size={18} />}
        onLeftClick={() => setShowUsers(false)}
        rightActions={headerRightActions}
        sticky={true}
      />

      <div className="p-3 border-b border-slate-800/80 bg-slate-950/40">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search current members by username or email..."
        />
      </div>

      <CollaboratorsList
        filteredProjectUsers={filteredProjectUsers}
        isOwner={isOwner}
        projectOwnerId={ownerId}
        currentUserId={currentUserId}
        setConfirmRemove={setConfirmRemove}
      />

      <CollaboratorsRemoveModal
        confirmRemove={confirmRemove}
        setConfirmRemove={setConfirmRemove}
        removeCollaborator={removeCollaborator}
        handleConfirmRemove={removeCollaborator}
      />

      <SuccessToast
        message={toastMessage}
        clearToast={() => setToastMessage("")}
        onClose={() => setToastMessage("")}
      />
    </div>
  );
};

export default Collaborators;
