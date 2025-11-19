import { useState } from "react";
import axiosInstance from "../config/axios";
import {
  Check,
  Users,
  UserPlus,
  ArrowLeft,
  X,
  Search,
  Trash2,
} from "lucide-react";
import { useUser } from "../contexts/user.context";
import { useProject } from "../contexts/project.context";

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

  // Fetch all users
  const fetchAllUsers = async () => {
    try {
      const res = await axiosInstance.get("/all");
      setAllUsers(res.data.allUsers);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle select / deselect
  const selectedUsersHandler = (user) => {
    const alreadyAdded = project?.users?.some((u) => u._id === user._id);
    if (alreadyAdded) return;

    const exists = selectedUsers.some((u) => u._id === user._id);
    if (exists) {
      setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  // Add collaborators
  const addCollaborator = async () => {
    if (!selectedUsers.length) return;

    const userIdArray = selectedUsers.map((user) => user._id);

    try {
      const res = await axiosInstance.post("/project/add-user", {
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
  };

  // Confirms and executes removal
  const handleConfirmRemove = () => {
    if (confirmRemove.userId) {
      removeCollaborator(confirmRemove.userId);
    }
  };

  // remove collaborator
  const removeCollaborator = async (userId) => {
    try {
      const res = await axiosInstance.post("/project/remove-user", {
        projectId: project._id,
        userId,
      });
      setProject(res.data.updatedProject);
      setConfirmRemove({ show: false, userId: null, username: "" });
    } catch (error) {
      console.error("Error removing collaborator:", error);
    }
  };

  // Filters members which are in a porject
  const filteredProjectUsers = project?.users?.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //  filter users
  const filteredAllUsers = allUsers.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 via-gray-900/80 to-gray-900/70 backdrop-blur-md">
        <button
          onClick={() => setShowUsers(false)}
          className="p-2 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft size={20} />
        </button>

        <h2 className="text-lg font-semibold text-gray-100 flex-1 tracking-wide">
          Collaborators
        </h2>

        {project.owner === currentUser._id ? (
          <button
            onClick={fetchAllUsers}
            className="p-2 rounded-full text-gray-400 hover:bg-blue-600/30 hover:text-blue-400 transition-colors duration-200"
          >
            <UserPlus size={18} />
          </button>
        ) : null}
      </header>

      {/* Search Bar */}
      <div className="px-6 py-3 border-b border-gray-800 bg-gray-900/40 backdrop-blur-md flex items-center gap-3">
        <div className="relative flex items-center w-full">
          <Search className="absolute left-3 text-gray-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search member..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-800/80 text-gray-100 placeholder-gray-500 
                 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 
                 outline-none transition-all duration-200"
          />
        </div>
      </div>

      {/* Collaborators List */}
      <section className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {filteredProjectUsers?.length > 0 ? (
          <ul className="divide-y divide-gray-800 rounded-xl border border-gray-800/60 overflow-hidden shadow-inner">
            {filteredProjectUsers.map((user) => (
              <li
                key={user._id}
                className="flex items-center justify-between px-5 py-3 hover:bg-gray-800/60 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover border border-gray-700 group-hover:border-blue-500/50 transition"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                      <Users size={20} className="text-gray-400" />
                    </div>
                  )}
                  <span className="text-gray-200 font-medium">
                    {user.username}
                  </span>
                </div>

                {/* Owner OR Remove Button */}
                {user._id === project.owner ? (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-medium border border-blue-500/30">
                    Owner
                  </span>
                ) : (
                  currentUser._id === project.owner && (
                    <button
                      onClick={() =>
                        setConfirmRemove({
                          show: true,
                          userId: user._id,
                          username: user.username,
                        })
                      } // Sets the state
                      className="text-sm px-2.5 py-0.5 rounded-lg text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all duration-200"
                    >
                      remove
                    </button>
                  )
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-10 text-gray-400 border border-gray-800/60 rounded-xl backdrop-blur-sm">
            <Users className="mx-auto text-gray-600 mb-3" size={42} />
            <p className="text-sm text-gray-500">
              {searchTerm
                ? "No users found for this search."
                : "No collaborators yet — invite some!"}
            </p>
          </div>
        )}
      </section>

      {/* Add Collaborator Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center animate-fadeIn">
          <div className="bg-gray-900/95 rounded-2xl w-[95%] max-w-[460px] h-[50vh] flex flex-col border border-gray-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden animate-slideUp">
            {/* Header */}
            <header className="flex items-center justify-between p-5 border-b border-gray-800">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                Add Collaborator
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedUsers([]);
                  setSearchQuery("");
                }}
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
              >
                <X size={20} />
              </button>
            </header>

            {/* Search & List */}
            <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
              {/* 🔍 Search Bar */}
              <div className="relative mb-5">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-800/80 text-gray-200 placeholder-gray-500 
      border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
      outline-none transition-all duration-200 hover:border-gray-600"
                />
              </div>

              {filteredAllUsers.length > 0 ? (
                <ul className="space-y-2">
                  {filteredAllUsers.map((user) => {
                    const isSelected = selectedUsers.some(
                      (u) => u._id === user._id
                    );
                    const alreadyAdded = project?.users?.some(
                      (u) => u._id === user._id
                    );

                    const baseClasses =
                      "flex items-center justify-between gap-3 p-3 rounded-xl border transition-all duration-200";

                    const mutedClasses =
                      "bg-gray-800/50 border-gray-700/50 opacity-50 cursor-not-allowed pointer-events-none";

                    const selectedClasses =
                      "bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-700/50 shadow-inner opacity-70";

                    const hoverClasses =
                      "hover:bg-gray-800/70 border-transparent cursor-pointer";

                    return (
                      <li
                        key={user._id}
                        onClick={() =>
                          !alreadyAdded && selectedUsersHandler(user)
                        }
                        className={`${baseClasses} ${
                          alreadyAdded
                            ? mutedClasses
                            : isSelected
                            ? selectedClasses
                            : hoverClasses
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {user.profilePic ? (
                            <img
                              src={user.profilePic}
                              alt={user.username}
                              className={`w-10 h-10 rounded-full object-cover border border-gray-700 ${
                                alreadyAdded ? "grayscale" : ""
                              }`}
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                              <Users size={20} className="text-gray-500" />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-gray-200 font-medium">
                              {user.username}
                            </span>
                          </div>
                        </div>

                        {!alreadyAdded &&
                          (isSelected ? (
                            <Check
                              className="text-blue-400 animate-pulse"
                              size={20}
                            />
                          ) : (
                            <div className="w-5 h-5 border border-gray-600 rounded-full"></div>
                          ))}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-center text-gray-500 mt-10">
                  No users found
                </div>
              )}
            </div>

            {/* Footer */}
            <footer className="p-5 border-t border-gray-800">
              <button
                onClick={addCollaborator}
                disabled={selectedUsers.length === 0}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                  selectedUsers.length === 0
                    ? "bg-gray-700 opacity-60 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.03] shadow-lg"
                }`}
              >
                Add as Collaborator
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Remove Collaborator Confirmation Modal (NEW ADDITION) */}
      {confirmRemove.show && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center animate-fadeIn">
          <div className="bg-gray-900/95 rounded-2xl w-[90%] max-w-sm p-6 border border-gray-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] animate-slideUp">
            <div className="flex flex-col items-center">
              <Trash2 size={40} className="text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                Remove Collaborator
              </h3>
              <p className="text-center text-gray-400 mb-6">
                Are you sure, you want to remove{" "}
                <strong className="text-red-400">
                  {confirmRemove.username}
                </strong>{" "}
                from this project? They will lose access immediately.
              </p>

              <div className="flex gap-4 w-full">
                <button
                  onClick={() =>
                    setConfirmRemove({
                      show: false,
                      userId: null,
                      username: "",
                    })
                  }
                  className="flex-1 py-2 rounded-lg text-gray-200 border border-gray-700 hover:bg-gray-800 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRemove}
                  className="flex-1 py-2 rounded-lg font-semibold bg-red-600 hover:bg-red-700 transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Collaborators;
