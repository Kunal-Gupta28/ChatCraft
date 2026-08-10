import { Network, Activity, Gauge, GitFork, Layers, Route, Link2, FolderTree, Package } from "lucide-react";
import { TAB_ACTIVE } from "./constants";

export const TABS = [
  { key: "overview", label: "Overview", icon: Activity, color: "cyan" },
  { key: "graph", label: "System Graph", icon: Network, color: "blue" },
  { key: "layers", label: "3-Tier Layers", icon: Layers, color: "amber" },
  { key: "api", label: "API Endpoints", icon: Route, color: "purple" },
  { key: "imports", label: "Dependencies", icon: Link2, color: "green" },
  { key: "files", label: "File Explorer", icon: FolderTree, color: "slate" },
  { key: "deps", label: "Tech Stack", icon: Package, color: "pink" },
];

const VisualizerHeader = ({ stats, viewMode, setViewMode }) => {
  return (
    <div className="border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-xl px-4 py-3 shrink-0">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Network size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-wide">Architecture Visualizer</h2>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                LIVE METRICS
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              {stats.fileCount} files · {stats.totalLines.toLocaleString()} lines · {stats.totalFuncs} functions
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-950/90 border border-slate-800/80 rounded-2xl">
          {TABS.map(({ key, label, icon: Icon, color }) => (
            <button
              key={key}
              type="button"
              onClick={() => setViewMode(key)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-semibold transition cursor-pointer ${
                viewMode === key ? TAB_ACTIVE[color] : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Icon size={11} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisualizerHeader;
