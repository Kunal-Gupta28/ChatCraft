import { useState, useCallback, useMemo } from "react";
import axiosInstance from "../../../config/axios";
import { useUser } from "../../../contexts/user.context";
import { useProject } from "../../../contexts/project.context";

import CollaboratorsHeader from "./CollaboratorsHeader";
import CollaboratorsSearch from "./CollaboratorsSearch";
import CollaboratorsList from "./CollaboratorsList";
import CollaboratorsAddModal from "./CollaboratorsAddModal";
import CollaboratorsRemoveModal from "./CollaboratorsRemoveModal";

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

  // Fetch all users from server and save it in setAllUser
  const fetchAllUsers = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/all");
      setAllUsers(res.data.allUsers);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  // edit alreadyAdded and existing user list
  const selectedUsersHandler = useCallback((user) => {
    const alreadyAdded = project?.users?.some((u) => u._id === user._id);
    if (alreadyAdded) return;

    setSelectedUsers((prev) => {
      const exists = prev.some((u) => u._id === user._id);
      if (exists) {
        return prev.filter((u) => u._id !== user._id);
      }
      return [...prev, user];
    });
  }, [project?.users]);

  // Add collaborator in project
  const addCollaborator = useCallback(async () => {
    if (!selectedUsers.length) return;

    const userIdArray = selectedUsers.map((u) => u._id);

    try {
      const res = await axiosInstance.put("/project/add-user", {
        projectId: project._id,
        users: userIdArray,
      });

      setProject(res.data.updatedProject);

      // Close modal and reset state
      setShowModal(false);
      setSelectedUsers([]);
      setSearchQuery("");
    } catch (error) {
      console.error("Error adding collaborator:", error);
    }
  }, [selectedUsers, project?._id, setProject]);

  // remove collaborator from project
  const removeCollaborator = useCallback(async (userId) => {
    try {
      const res = await axiosInstance.put("/project/remove-user", {
        data: {
          projectId: project._id,
          userId,
        },
      });

      setProject(res.data.updatedProject);

      setConfirmRemove({
        show: false,
        userId: null,
        username: "",
      });
    } catch (error) {
      console.error("Error removing collaborator:", error);
    }
  }, [project?._id, setProject]);

  // Confirms and executes removal
  const handleConfirmRemove = useCallback(() => {
    if (confirmRemove.userId) {
      removeCollaborator(confirmRemove.userId);
    }
  }, [confirmRemove.userId, removeCollaborator]);

  // Filters members which are in a project
  const filteredProjectUsers = useMemo(() => {
    return (
      project?.users?.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      ) || []
    );
  }, [project?.users, searchTerm]);

  // filter users
  const filteredAllUsers = useMemo(() => {
    return allUsers.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allUsers, searchQuery]);

  return (
    <>
      <CollaboratorsHeader
        project={project}
        currentUser={currentUser}
        setShowUsers={setShowUsers}
        fetchAllUsers={fetchAllUsers}
      />

      <CollaboratorsSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <CollaboratorsList
        filteredProjectUsers={filteredProjectUsers}
        project={project}
        currentUser={currentUser}
        setConfirmRemove={setConfirmRemove}
      />

      {showModal && (
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
      )}

      {confirmRemove.show && (
        <CollaboratorsRemoveModal
          confirmRemove={confirmRemove}
          setConfirmRemove={setConfirmRemove}
          handleConfirmRemove={handleConfirmRemove}
        />
      )}
    </>
  );
};

export default Collaborators;