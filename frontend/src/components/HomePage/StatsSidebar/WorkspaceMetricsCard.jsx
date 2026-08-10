import { memo } from "react";
import {
  Activity, Sparkles, FolderCode, Users, FileCode, Calendar, Zap, Bot, Terminal
} from "lucide-react";

const WorkspaceMetricsCard = ({ stats, mobileShowStats }) => {
  return (
    <div className={`${mobileShowStats ? "block" : "hidden md:block"} bg-gray-900/80 border border-gray-800 p-4 sm:p-5 rounded-2xl backdrop-blur-xl shadow-xl relative overflow-hidden`}>
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-blue-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">Workspace Health</h3>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-950/60 border border-gray-800 p-3 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
            <FolderCode size={14} className="text-blue-400 shrink-0" />
            <span>Projects</span>
          </div>
          <p className="text-xl font-black text-white font-mono">{stats.totalProjects}</p>
        </div>

        <div className="bg-gray-950/60 border border-gray-800 p-3 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
            <Users size={14} className="text-purple-400 shrink-0" />
            <span>Peers</span>
          </div>
          <p className="text-xl font-black text-white font-mono">{stats.totalCollaborators}</p>
        </div>

        <div className="bg-gray-950/60 border border-gray-800 p-3 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
            <FileCode size={14} className="text-amber-400 shrink-0" />
            <span>Files</span>
          </div>
          <p className="text-xl font-black text-white font-mono">{stats.totalFileCount}</p>
        </div>

        <div className="bg-gray-950/60 border border-gray-800 p-3 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
            <Calendar size={14} className="text-emerald-400 shrink-0" />
            <span>7-Day Active</span>
          </div>
          <p className="text-xl font-black text-white font-mono">+{stats.recent7DaysCount}</p>
        </div>
      </div>

      {/* AI Features Badge */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 p-3 rounded-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 mb-2">
          <Sparkles size={14} className="text-blue-400 animate-pulse" />
          <span>AI IDE Power Suite Active</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-gray-300">
          <div className="flex items-center gap-1.5">
            <Bot size={12} className="text-cyan-400" />
            <span>Gemini 2.5</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Terminal size={12} className="text-purple-400" />
            <span>WebContainer</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(WorkspaceMetricsCard);
