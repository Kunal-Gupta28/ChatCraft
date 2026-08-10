import { memo } from "react";
import { ShieldCheck, Activity, Crown, Share2 } from "lucide-react";

const UserProfileCard = ({
  user,
  mobileShowStats,
  setMobileShowStats,
  ownedCount,
  sharedCount,
}) => {
  return (
    <div className="bg-gray-900/80 border border-gray-800 p-4 rounded-2xl backdrop-blur-xl shadow-lg relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-0.5 shrink-0">
            {user?.profilePic ? (
              <img src={user.profilePic} alt="avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-950 flex items-center justify-center text-white font-bold text-sm">
                {user?.username?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-white capitalize">{user?.username || "Developer"}</p>
            <p className="text-[11px] text-gray-400 flex items-center gap-1">
              <ShieldCheck size={12} className="text-blue-400" />
              <span>Workspace Admin</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileShowStats((prev) => !prev)}
          className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold hover:bg-blue-500/20 transition cursor-pointer"
        >
          <Activity size={14} />
          <span>{mobileShowStats ? "Hide Stats" : "Stats"}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-800/80">
        <div className="flex items-center gap-1.5 text-yellow-400 font-medium bg-gray-800/40 px-2.5 py-1.5 rounded-xl border border-gray-700/40">
          <Crown size={13} />
          <span>{ownedCount} Owned</span>
        </div>
        <div className="flex items-center gap-1.5 text-purple-400 font-medium bg-gray-800/40 px-2.5 py-1.5 rounded-xl border border-gray-700/40">
          <Share2 size={13} />
          <span>{sharedCount} Shared</span>
        </div>
      </div>
    </div>
  );
};

export default memo(UserProfileCard);
