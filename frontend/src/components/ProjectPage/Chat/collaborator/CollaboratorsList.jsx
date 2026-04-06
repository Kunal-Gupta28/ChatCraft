import { memo, useCallback } from "react";
import { Users } from "lucide-react";

const CollaboratorsList = ({
  filteredProjectUsers,
  isOwner,
  projectOwnerId,
  setConfirmRemove,
}) => {
  const handleRemoveClick = useCallback(
    (user) => {
      setConfirmRemove({
        show: true,
        userId: user._id,
        username: user.username,
      });
    },
    [setConfirmRemove]
  );

  return (
    <section className="flex-1 overflow-y-auto p-6 custom-scrollbar select-none">
      {filteredProjectUsers.length > 0 ? (
        <ul className="divide-y divide-gray-800 rounded-xl border border-gray-800/60 overflow-hidden shadow-inner">
          {filteredProjectUsers.map((user) => {
            const isProjectOwner = user._id === projectOwnerId;

            return (
              <li
                key={user._id}
                className="group flex items-center justify-between px-5 py-3 hover:bg-gray-800/60 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.username}
                      loading="lazy"
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

                {isProjectOwner ? (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Owner
                  </span>
                ) : (
                  isOwner && (
                    <button
                      onClick={() => handleRemoveClick(user)}
                      className="text-sm px-2.5 py-0.5 rounded-lg text-red-400 
                      opacity-0 translate-x-2 
                      group-hover:opacity-100 group-hover:translate-x-0
                      hover:bg-red-500/20 transition-all duration-200 cursor-pointer"
                    >
                      Remove
                    </button>
                  )
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-center py-10 text-gray-400 border border-gray-800/60 rounded-xl backdrop-blur-sm">
          <Users className="mx-auto text-gray-600 mb-3" size={42} />
          <p className="text-sm text-gray-500">No collaborators found.</p>
        </div>
      )}
    </section>
  );
};

export default memo(CollaboratorsList);