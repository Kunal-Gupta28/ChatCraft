import { ArrowLeft, UserPlus } from "lucide-react";

const CollaboratorsHeader = ({
  project,
  currentUser,
  setShowUsers,
  fetchAllUsers,
}) => {
  return (
    <header className="flex items-center gap-3 px-6 py-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 via-gray-900/80 to-gray-900/70 backdrop-blur-md">
      {/* back button to close the collaborators */}
      <button
        onClick={() => setShowUsers(false)}
        className="p-2 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-200 cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Heading */}
      <h2 className="text-lg font-semibold text-gray-100 flex-1 tracking-wide select-none">
        Collaborators
      </h2>

      {/* show only owner of project */}
      {project?.owner === currentUser._id && (
        <button
          onClick={fetchAllUsers}
          className="p-2 rounded-full text-gray-400 hover:bg-blue-600/30 hover:text-blue-400 transition-colors duration-200 cursor-pointer"
        >
          <UserPlus size={18} />
        </button>
      )}
    </header>
  );
};

export default CollaboratorsHeader;
