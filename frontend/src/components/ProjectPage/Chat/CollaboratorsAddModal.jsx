import { memo, useCallback, useMemo } from "react";
import { X, Search, Check, Users } from "lucide-react";

const CollaboratorsAddModal = ({
  filteredAllUsers,
  selectedUsers,
  selectedUsersHandler,
  addCollaborator,
  setShowModal,
  setSelectedUsers,
  searchQuery,
  setSearchQuery,
  projectUsers,
}) => {

  const handleClose = useCallback(() => {
    setShowModal(false);
    setSelectedUsers([]);
    setSearchQuery("");
  }, [setShowModal, setSelectedUsers, setSearchQuery]);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, [setSearchQuery]);

  const selectedIds = useMemo(
    () => new Set(selectedUsers.map((u) => u._id)),
    [selectedUsers]
  );

  const projectUserIds = useMemo(
    () => new Set(projectUsers?.map((u) => u._id)),
    [projectUsers]
  );

  const isDisabled = selectedUsers.length === 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center animate-fadeIn select-none">
      {/* Add Collaborator Modal */}

      <div className="bg-gray-900/95 rounded-2xl w-[95%] max-w-[460px] h-[50vh] flex flex-col border border-gray-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden animate-slideUp">
        <header className="flex items-center justify-between p-5 border-b border-gray-800">

          {/* heading */}
          <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Add Collaborator
          </h3>

          {/* close button */}
          <button
            onClick={handleClose}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </header>

        {/* Search + List */}
        <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
          <div className="relative mb-5">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            {/* input filed */}
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-800/80 text-gray-200 placeholder-gray-500 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all duration-200 hover:border-gray-600"
            />
          </div>

          {filteredAllUsers.length > 0 ? (
            <ul className="space-y-2">
              {filteredAllUsers.map((user) => {
                const isSelected = selectedIds.has(user._id);
                const alreadyAdded = projectUserIds.has(user._id);

                const base =
                  "flex items-center justify-between gap-3 p-3 rounded-xl border transition-all duration-200";
                const disabled =
                  "bg-gray-800/50 border-gray-700/50 opacity-50 cursor-not-allowed pointer-events-none";
                const selected =
                  "bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-700/50 shadow-inner opacity-70 cursor-pointer";
                const hoverable =
                  "hover:bg-gray-800/70 border-transparent cursor-pointer";

                return (
                  <li
                    key={user._id}
                    onClick={() => !alreadyAdded && selectedUsersHandler(user)}
                    className={`${base} ${
                      alreadyAdded
                        ? disabled
                        : isSelected
                        ? selected
                        : hoverable
                    }`}
                  >
                    <div className="flex items-center gap-3">

                      {/* avatar */}
                      {user.profilePic ? (
                        <img
                          src={user.profilePic}
                          alt={user.username}
                          loading="lazy"
                          className={`w-10 h-10 rounded-full object-cover border border-gray-700 ${
                            alreadyAdded ? "grayscale" : ""
                          }`}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                          <Users size={20} className="text-gray-500" />
                        </div>
                      )}

                      {/* username */}
                      <span className="text-gray-200 font-medium">
                        {user.username}
                      </span>
                    </div>

                    {!alreadyAdded &&
                      (isSelected ? (
                        <Check
                          className="text-blue-400 animate-pulse"
                          size={20}
                        />
                      ) : (
                        <div className="w-5 h-5 border border-gray-600 rounded-full" />
                      ))}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-center text-gray-500 mt-10">No users found</p>
          )}
        </div>

        {/* collaborator button  */}
        <footer className="p-5 border-t border-gray-800">
          <button
            onClick={addCollaborator}
            disabled={isDisabled}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
              isDisabled
                ? "bg-gray-700 opacity-60 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.03] shadow-lg cursor-pointer"
            }`}
          >
            Add as Collaborator
          </button>
        </footer>
      </div>
    </div>
  );
};

export default memo(CollaboratorsAddModal);