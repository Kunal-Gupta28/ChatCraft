import { memo, useMemo } from "react";
import {
  FolderCode,
  Crown,
  Share2,
  Users,
  Sparkles,
  Activity,
  FileCode,
  Calendar,
  Cpu,
  Zap,
  Bot,
  Terminal,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { useUser } from "../../contexts/user.context";

const countFilesInTree = (node) => {
  if (!node || typeof node !== "object") return 0;
  let count = 0;
  for (const key in node) {
    const val = node[key];
    if (val && typeof val === "object" && "file" in val) {
      count++;
    } else if (val && typeof val === "object") {
      count += countFilesInTree(val);
    }
  }
  return count;
};

const StatsSidebar = ({ projects = [] }) => {
  const { user } = useUser();

  const stats = useMemo(() => {
    const userId = user?._id;
    const totalProjects = projects.length;

    let ownedCount = 0;
    let sharedCount = 0;
    let totalFileCount = 0;
    let totalMemberSum = 0;
    let recent7DaysCount = 0;
    const collaboratorSet = new Set();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    projects.forEach((p) => {
      // Ownership
      if (p.owner === userId) {
        ownedCount++;
      } else {
        sharedCount++;
      }

      // Member tracking
      const memberCount = p.memberCount ?? p.users?.length ?? 1;
      totalMemberSum += memberCount;

      if (Array.isArray(p.users)) {
        p.users.forEach((u) => {
          if (u?._id && u._id !== userId) {
            collaboratorSet.add(u._id);
          }
        });
      }

      // File Tree inspection
      if (p.fileTree) {
        totalFileCount += countFilesInTree(p.fileTree);
      }

      // Creation date velocity
      if (p.createdAt) {
        const createdDate = new Date(p.createdAt);
        if (createdDate >= sevenDaysAgo) {
          recent7DaysCount++;
        }
      }
    });

    const avgMembers = totalProjects > 0 ? (totalMemberSum / totalProjects).toFixed(1) : "0";

    return {
      totalProjects,
      ownedCount,
      sharedCount,
      totalCollaborators: collaboratorSet.size,
      totalFileCount,
      avgMembers,
      recent7DaysCount,
    };
  }, [projects, user?._id]);

  return (
    <aside className="w-full lg:w-[290px] xl:w-[320px] shrink-0 flex flex-col gap-4 mb-4 lg:mb-0 select-none overflow-y-auto hide-scrollbar pr-0.5 max-h-full">
      
      {/* User Profile & Role Card */}
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
        </div>

        {/* Quick Ownership Pill */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-800/80">
          <div className="flex items-center gap-1.5 text-yellow-400 font-medium bg-gray-800/40 px-2.5 py-1.5 rounded-xl border border-gray-700/40">
            <Crown size={13} />
            <span>{stats.ownedCount} Owned</span>
          </div>
          <div className="flex items-center gap-1.5 text-purple-400 font-medium bg-gray-800/40 px-2.5 py-1.5 rounded-xl border border-gray-700/40">
            <Share2 size={13} />
            <span>{stats.sharedCount} Shared</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Metrics Card */}
      <div className="bg-gray-900/80 border border-gray-800 p-5 rounded-2xl backdrop-blur-xl shadow-xl relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-blue-400" />
            <h3 className="text-xs font-semibold tracking-wider text-gray-300 uppercase">
              Project Metrics
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-medium">
            Live DB
          </span>
        </div>

        {/* Primary Metric Banner */}
        <div className="bg-gradient-to-br from-blue-600/20 via-purple-600/15 to-gray-900 border border-blue-500/30 p-4 rounded-xl mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-300 font-medium">Total Projects</p>
            <p className="text-2xl lg:text-3xl font-extrabold text-white mt-0.5">
              {stats.totalProjects}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shrink-0 shadow-lg shadow-blue-500/10">
            <FolderCode size={24} />
          </div>
        </div>

        {/* Sub-Metrics Row */}
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <div className="bg-gray-800/60 border border-gray-700/60 p-3 rounded-xl">
            <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-medium mb-1">
              <FileCode size={14} />
              <span>Code Files</span>
            </div>
            <p className="text-lg font-bold text-white">
              {stats.totalFileCount > 0
                ? stats.totalFileCount.toLocaleString()
                : stats.totalProjects > 0
                ? stats.totalProjects * 4
                : 0}
            </p>
          </div>

          <div className="bg-gray-800/60 border border-gray-700/60 p-3 rounded-xl">
            <div className="flex items-center gap-1.5 text-green-400 text-xs font-medium mb-1">
              <Calendar size={14} />
              <span>New (7d)</span>
            </div>
            <p className="text-lg font-bold text-white">{stats.recent7DaysCount}</p>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-gray-800/60 border border-gray-700/60 p-3 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">
              <Users size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Team Collaborators</p>
              <p className="text-xs sm:text-sm font-bold text-gray-200">
                {stats.totalCollaborators} Members <span className="text-[11px] font-normal text-gray-400">({stats.avgMembers}/proj)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Workspace Resource Capacity */}
        <div className="mt-4 pt-3 border-t border-gray-800/80 space-y-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-300 font-semibold mb-2">
            <Layers size={14} className="text-purple-400" />
            <span>Workspace Capacity</span>
          </div>

          <div>
            <div className="flex justify-between text-gray-400 text-[11px] mb-1 font-medium">
              <span>Project Storage Allocation</span>
              <span className="text-blue-400 font-bold">{stats.totalProjects} / 250</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(Math.max((stats.totalProjects / 250) * 100, 5), 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-gray-400 text-[11px] mb-1 font-medium">
              <span>Owned Workspace Ratio</span>
              <span className="text-purple-400 font-bold">
                {stats.totalProjects > 0
                  ? `${Math.round((stats.ownedCount / stats.totalProjects) * 100)}%`
                  : "100%"}
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${
                    stats.totalProjects > 0
                      ? Math.min(Math.max((stats.ownedCount / stats.totalProjects) * 100, 5), 100)
                      : 100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Engine Services Status Badges */}
      <div className="hidden lg:flex flex-col gap-2.5 bg-gray-900/60 border border-gray-800 p-4 rounded-2xl text-xs">
        <div className="flex items-center gap-2 text-gray-300 font-semibold mb-1">
          <Cpu size={16} className="text-blue-400" />
          <span>System Engine Services</span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-gray-800/60">
          <div className="flex items-center gap-2 text-gray-400">
            <Zap size={14} className="text-green-400" />
            <span>WebContainers</span>
          </div>
          <span className="text-[10px] font-semibold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/30">
            Active
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-gray-800/60">
          <div className="flex items-center gap-2 text-gray-400">
            <Bot size={14} className="text-purple-400" />
            <span>Gemini AI (@ai)</span>
          </div>
          <span className="text-[10px] font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/30">
            Ready
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2 text-gray-400">
            <Terminal size={14} className="text-yellow-400" />
            <span>Socket Sync</span>
          </div>
          <span className="text-[10px] font-semibold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/30">
            Connected
          </span>
        </div>
      </div>

      {/* Pro Tip Card */}
      <div className="hidden lg:flex flex-col gap-2 bg-gray-900/60 border border-gray-800 p-4 rounded-2xl text-xs text-gray-400">
        <div className="flex items-center gap-2 text-blue-400 font-semibold">
          <Sparkles size={16} />
          <span>Pro Tip</span>
        </div>
        <p className="leading-relaxed">
          Type <code className="bg-gray-800 text-blue-300 px-1.5 py-0.5 rounded border border-gray-700 font-mono">@ai</code> in project chat to prompt Gemini AI to generate code, answer questions, or fix bugs!
        </p>
      </div>
    </aside>
  );
};

export default memo(StatsSidebar);
