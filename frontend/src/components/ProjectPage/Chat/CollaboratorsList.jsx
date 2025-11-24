import { Users } from "lucide-react";

const CollaboratorsList = ({
  filteredProjectUsers,
  project,
  currentUser,
  setConfirmRemove,
}) => {
  return (
    <section className="flex-1 overflow-y-auto p-6 custom-scrollbar select-none">

      {/* Collaborators List */}
      {filteredProjectUsers.length > 0 ? (
        <ul className="divide-y divide-gray-800 rounded-xl border border-gray-800/60 overflow-hidden shadow-inner">
          {filteredProjectUsers.map((user) => (
            <li
              key={user._id}
              className="flex items-center justify-between px-5 py-3 hover:bg-gray-800/60 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">

                {/* if avatar presint in context then show avatar otherwise show user icon */}
                {user.profilePic ? (

                  // avatar
                  <img
                    src={user.profilePic}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover border border-gray-700 group-hover:border-blue-500/50 transition"
                  />
                ) : (

                  // user icon
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                    <Users size={20} className="text-gray-400" />
                  </div>
                )}

                {/* username */}
                <span className="text-gray-200 font-medium">
                  {user.username}
                </span>
              </div>

              {/* Owner badge ( only visible for project owner ) OR Remove Button ( only project owner can remove member ) */}
              {user._id === project.owner ? (

                // owner
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-medium border border-blue-500/30">
                  Owner
                </span>
              ) : (

                // remove button ( only visible for owner )
                currentUser._id === project.owner && (
                  <button
                    onClick={() =>
                      setConfirmRemove({
                        show: true,
                        userId: user._id,
                        username: user.username,
                      })
                    }
                    className="text-sm px-2.5 py-0.5 rounded-lg text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all duration-200 cursor-pointer"
                  >
                    remove
                  </button>
                )
              )}
            </li>
          ))}
        </ul>
      ) : (

        //  if no user present in project context then show user icon and paragraph 
        <div className="text-center py-10 text-gray-400 border border-gray-800/60 rounded-xl backdrop-blur-sm">
          <Users className="mx-auto text-gray-600 mb-3" size={42} />
          <p className="text-sm text-gray-500">No collaborators found.</p>
        </div>
      )}
    </section>
  );
};

export default CollaboratorsList;
