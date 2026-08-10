import { memo, useCallback } from "react";
import { Users, Trash2 } from "lucide-react";

const CollaboratorsList = ({
  filteredProjectUsers,
  isOwner,
  projectOwnerId,
  currentUserId,
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
    <section className="flex-1 overflow-y-auto p-3 hide-scrollbar select-none font-sans">
      {filteredProjectUsers.length > 0 ? (
        <ul className="space-y-1.5">
          {filteredProjectUsers.map((user) => {
            const isProjectOwner = String(user._id) === String(projectOwnerId);
            const isCurrentUser = String(user._id) === String(currentUserId);

            return (
              <li
                key={user._id}
                className="group flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-200"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.username}
                      loading="lazy"
                      className="w-9 h-9 rounded-full object-cover border border-slate-700/80 group-hover:border-blue-500/50 transition shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-900 to-slate-800 rounded-full flex items-center justify-center font-bold text-xs text-indigo-300 border border-indigo-500/30 shrink-0">
                      {user.username?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}

                  <div className="flex flex-col min-w-0">
                    <span className="text-slate-100 text-xs font-semibold capitalize tracking-wide truncate">
                      {user.username}
                    </span>
                    {user.email && (
                      <span className="text-[10px] text-slate-500 font-mono truncate">
                        {user.email}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {isProjectOwner ? (
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/40 shadow-sm">
                      {isCurrentUser ? "Owner (You)" : "Owner"}
                    </span>
                  ) : isCurrentUser ? (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      You
                    </span>
                  ) : (
                    isOwner && (
                      <button
                        type="button"
                        aria-label="Remove member"
                        onClick={() => handleRemoveClick(user)}
                        className="text-xs px-2.5 py-1 rounded-lg text-red-400 hover:bg-red-500/15 transition cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    )
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-center py-12 text-slate-400 select-none">
          <Users className="mx-auto text-slate-600 mb-2" size={36} />
          <p className="text-xs text-slate-500">No members found</p>
        </div>
      )}
    </section>
  );
};

export default memo(CollaboratorsList);
