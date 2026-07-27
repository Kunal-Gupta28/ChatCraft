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

// reusable filter function
const filterUsers = (users = [], query = "") =>
  users.filter((u) => u.username.toLowerCase().includes(query.toLowerCase()));

const Collaborators = ({ setShowUsers }) => {
  // context api
  const { project, setProject } = useProject();
  const { user: currentUser } = useUser();

  // state variables
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

  const ownerId = typeof project?.owner === "object" ? project?.owner?._id : project?.owner;
  const currentUserId = currentUser?._id;
  const isOwner = Boolean(
    ownerId && currentUserId && String(ownerId) === String(currentUserId)
  );

  // reset states
  const resetModalState = useCallback(() => {
    setShowModal(false);
    setSelectedUsers([]);
    setSearchQuery("");
  }, []);

  // fetchAllUsers
  const fetchAllUsers = async () => {
    try {
      const res = await axiosInstance.get("/all");
      setAllUsers(res.data.allUsers);
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const selectedUsersHandler = useCallback(
    (user) => {
      const alreadyAdded = project?.users?.some((u) => String(u._id) === String(user._id));
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

  // add collaborator
  const addCollaborator = useCallback(async () => {
    if (!selectedUsers.length) return;

    try {
      const res = await axiosInstance.put("/project/add-user", {
        projectId: project._id,
        users: selectedUsers.map((u) => u._id),
      });

      if (res.status === 200) {
        setProject((prev) => ({
          ...prev,
          users: [...(prev.users || []), ...selectedUsers],
        }));

        setToastMessage(`${selectedUsers.length} collaborator(s) added`);
        resetModalState();
      }
    } catch (error) {
      console.error(error);
    }
  }, [selectedUsers, project?._id, setProject, resetModalState]);

  // remove collaborator
  const removeCollaborator = useCallback(
    async (userId) => {
      try {
        const res = await axiosInstance.put("/project/remove-user", {
          projectId: project._id,
          userId,
        });

        if (res.status === 200) {
          setProject((prev) => ({
            ...prev,
            users: (prev.users || []).filter((u) => String(u._id) !== String(userId)),
          }));
          setToastMessage(`"${confirmRemove.username}" removed successfully`);
          setConfirmRemove({ show: false, userId: null, username: "" });
        }
      } catch (error) {
        console.error(error);
      }
    },
    [project?._id, setProject, confirmRemove.username],
  );

  const filteredProjectUsers = useMemo(
    () => filterUsers(project?.users, searchTerm),
    [project?.users, searchTerm],
  );

  const filteredAllUsers = useMemo(
    () => filterUsers(allUsers, searchQuery),
    [allUsers, searchQuery],
  );

  // Render full-height Add Members view when active
  if (showModal) {
    return (
      <div className="w-full h-full flex flex-col bg-[#090d16]/95 backdrop-blur-2xl select-none relative">
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
        />

        <SuccessToast
          message={toastMessage}
          clearToast={() => setToastMessage("")}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#090d16]/95 backdrop-blur-2xl select-none relative">
      <Header
        title="Project Members"
        leftIcon={<ArrowLeft size={18} />}
        onLeftClick={() => setShowUsers(false)}
        rightActions={[
          {
            icon: <UserPlus size={15} />,
            label: "Add",
            onClick: fetchAllUsers,
            variant: "primary",
            title: "Add New Collaborators",
          },
        ]}
      />

      <div className="p-3 border-b border-slate-800/80 bg-slate-950/40">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search member..."
        />
      </div>

      <CollaboratorsList
        filteredProjectUsers={filteredProjectUsers}
        isOwner={isOwner}
        projectOwnerId={ownerId}
        setConfirmRemove={setConfirmRemove}
      />

      {confirmRemove.show && (
        <CollaboratorsRemoveModal
          confirmRemove={confirmRemove}
          setConfirmRemove={setConfirmRemove}
          handleConfirmRemove={() => removeCollaborator(confirmRemove.userId)}
        />
      )}

      <SuccessToast
        message={toastMessage}
        clearToast={() => setToastMessage("")}
      />
    </div>
  );
};

export default Collaborators;
