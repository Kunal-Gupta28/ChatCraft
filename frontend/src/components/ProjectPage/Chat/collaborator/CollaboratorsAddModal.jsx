import { memo, useCallback, useMemo } from "react";
import { ArrowLeft, Check, UserPlus } from "lucide-react";
import SearchBar from "../../../SearchBar";
import Header from "../Header";

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
  currentUserId,
}) => {
  const handleClose = useCallback(() => {
    setShowModal(false);
    setSelectedUsers([]);
    setSearchQuery("");
  }, [setShowModal, setSelectedUsers, setSearchQuery]);

  const selectedIds = useMemo(
    () => new Set(selectedUsers.map((u) => u._id)),
    [selectedUsers]
  );

  const projectUserIds = useMemo(
    () => new Set(projectUsers?.map((u) => u._id)),
    [projectUsers]
  );

  const availableUsers = useMemo(() => {
    return filteredAllUsers.filter((u) => String(u._id) !== String(currentUserId));
  }, [filteredAllUsers, currentUserId]);

  const isDisabled = selectedUsers.length === 0;

  return (
    <div className="w-full h-full flex flex-col bg-[#090d16]/95 backdrop-blur-2xl select-none font-sans">
      {/* Header */}
      <Header
        title="Add Members"
        leftIcon={<ArrowLeft size={18} />}
        onLeftClick={handleClose}
        sticky={true}
      />

      {/* Search Bar */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-950/40">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by username or email..."
        />
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto p-3 hide-scrollbar">
        {availableUsers.length > 0 ? (
          <ul className="space-y-1.5">
            {availableUsers.map((user) => {
              const isSelected = selectedIds.has(user._id);
              const alreadyAdded = projectUserIds.has(user._id);

              return (
                <li
                  key={user._id}
                  onClick={() =>
                    !alreadyAdded && selectedUsersHandler(user)
                  }
                  className={`group flex items-center justify-between gap-3 p-3 rounded-2xl transition-all border ${
                    alreadyAdded
                      ? "bg-slate-900/40 opacity-50 cursor-not-allowed border-transparent"
                      : isSelected
                      ? "bg-blue-600/15 border-blue-500/50 shadow-sm cursor-pointer"
                      : "hover:bg-slate-800/60 border-slate-800/80 cursor-pointer"
                  }`}
                >
                  {/* User info */}
                  <div className="flex items-center gap-3">
                    {user.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={user.username}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="flex flex-col">
                      <span className="text-slate-100 text-xs font-semibold capitalize">
                        {user.username}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {user.email || "No email available"}
                      </span>
                      {alreadyAdded && (
                        <span className="text-[10px] text-amber-400/80 font-medium">
                          Already added to project
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Selection indicator */}
                  {!alreadyAdded && (
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${
                        isSelected
                          ? "bg-blue-600 border-blue-500 text-white"
                          : "border-slate-700 group-hover:border-slate-500"
                      }`}
                    >
                      {isSelected && <Check size={12} />}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <p className="text-xs text-slate-500">No users found matching your search</p>
          </div>
        )}
      </div>

      {/* Footer action button */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        <button
          type="button"
          disabled={isDisabled}
          onClick={addCollaborator}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <UserPlus size={15} />
          <span>
            Add Selected Members {selectedUsers.length > 0 ? `(${selectedUsers.length})` : ""}
          </span>
        </button>
      </div>
    </div>
  );
};

export default memo(CollaboratorsAddModal);