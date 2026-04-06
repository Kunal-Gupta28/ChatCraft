import { memo, useCallback, useMemo } from "react";
import { X, Check } from "lucide-react";
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
}) => {
  // close modal
  const handleClose = useCallback(() => {
    setShowModal(false);
    setSelectedUsers([]);
    setSearchQuery("");
  }, [setShowModal, setSelectedUsers, setSearchQuery]);

  // selected users set
  const selectedIds = useMemo(
    () => new Set(selectedUsers.map((u) => u._id)),
    [selectedUsers]
  );

  // already added users set
  const projectUserIds = useMemo(
    () => new Set(projectUsers?.map((u) => u._id)),
    [projectUsers]
  );

  const isDisabled = selectedUsers.length === 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl flex items-center justify-center animate-fadeIn">
      
      {/* Modal */}
      <div className="bg-gray-900/90 rounded-2xl w-[95%] max-w-[480px] h-[65vh] flex flex-col border border-gray-800 shadow-2xl overflow-hidden">
        
        {/* ✅ Reusable Header */}
        <Header
          title="Add Collaborators"
          leftIcon={<X size={20} />}
          onLeftClick={handleClose}
          sticky={false}
        />

        {/* Search */}
        <div className="px-6 py-4 border-b border-gray-800">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search users..."
          />
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 custom-scrollbar">
          {filteredAllUsers.length > 0 ? (
            <ul className="space-y-2">
              {filteredAllUsers.map((user) => {
                const isSelected = selectedIds.has(user._id);
                const alreadyAdded = projectUserIds.has(user._id);

                return (
                  <li
                    key={user._id}
                    onClick={() =>
                      !alreadyAdded && selectedUsersHandler(user)
                    }
                    className={`group flex items-center justify-between gap-3 p-3 rounded-xl transition-all duration-200 border ${
                      alreadyAdded
                        ? "bg-gray-800/40 opacity-50 cursor-not-allowed"
                        : isSelected
                        ? "bg-blue-600/10 border-blue-500/40"
                        : "hover:bg-gray-800/70 border-transparent cursor-pointer"
                    }`}
                  >
                    {/* LEFT */}
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="flex flex-col">
                        <span className="text-gray-200 font-medium">
                          {user.username}
                        </span>
                        {alreadyAdded && (
                          <span className="text-xs text-gray-400">
                            Already added
                          </span>
                        )}
                      </div>
                    </div>

                    {/* RIGHT (checkbox) */}
                    {!alreadyAdded && (
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                          isSelected
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-500 group-hover:border-gray-300"
                        }`}
                      >
                        {isSelected && <Check size={14} />}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center mt-16 text-gray-500">
              <p className="text-sm">No users found</p>
              <span className="text-xs mt-1">
                Try a different keyword
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="sticky bottom-0 p-5 border-t border-gray-800 bg-gray-900/80 backdrop-blur-md">
          <button
            onClick={addCollaborator}
            disabled={isDisabled}
            className={`w-full py-3 rounded-lg font-semibold transition-all ${
              isDisabled
                ? "bg-gray-700 opacity-60 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            Add {selectedUsers.length > 0 && `(${selectedUsers.length})`}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default memo(CollaboratorsAddModal);