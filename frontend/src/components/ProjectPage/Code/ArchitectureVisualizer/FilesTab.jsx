import { memo } from "react";
import { BarChart3, Search, FileCode } from "lucide-react";
import { getExtColor } from "./constants";

const FilesTab = ({
  filteredMetrics,
  stats,
  searchQuery,
  setSearchQuery,
  maxLines,
  setHoveredFile,
}) => {
  return (
    <div className="rounded-3xl border border-pink-500/25 bg-slate-950/70 overflow-hidden shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-slate-800 bg-pink-950/10">
        <div className="flex items-center gap-2.5">
          <BarChart3 size={18} className="text-pink-400" />
          <div>
            <h4 className="text-sm font-bold text-pink-200">File Metrics</h4>
            <p className="text-[10px] text-slate-400">Lines · Bytes · Functions detected</p>
          </div>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Filter files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-2 text-[11px] bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-400/40 font-mono w-48 transition"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 px-5 py-3 border-b border-slate-800/60 bg-slate-900/40 text-[10px] font-mono">
        <span className="text-slate-400">{stats.fileCount} files</span>
        <span className="text-pink-300 font-bold">{stats.totalLines.toLocaleString()} lines</span>
        <span className="text-slate-400">{stats.totalFuncs} functions</span>
        <span className="text-slate-400">
          {stats.totalBytes < 1024 ? `${stats.totalBytes}B` : `${(stats.totalBytes / 1024).toFixed(1)}KB`}
        </span>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-12 gap-2 px-4 py-2 border-b border-slate-800/60 text-[9px] font-mono text-slate-500 uppercase tracking-wider bg-slate-900/30">
        <span className="col-span-5">File</span>
        <span className="col-span-3">Lines</span>
        <span className="col-span-2 text-right">Fns</span>
        <span className="col-span-2 text-right">Size</span>
      </div>

      <div className="divide-y divide-slate-800/40 max-h-[400px] overflow-y-auto">
        {filteredMetrics.map(({ fp, lines, bytes, funcs }) => (
          <div
            key={fp}
            className="grid grid-cols-12 gap-2 px-4 py-2.5 hover:bg-slate-900/60 transition text-xs font-mono group items-center"
            onMouseEnter={() => setHoveredFile && setHoveredFile(fp)}
            onMouseLeave={() => setHoveredFile && setHoveredFile(null)}
          >
            <div className="col-span-5 flex items-center gap-2 min-w-0">
              <FileCode size={12} className={`${getExtColor(fp)} shrink-0`} />
              <span className="text-slate-200 truncate font-semibold">{fp}</span>
            </div>
            <div className="col-span-3 flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-pink-400 transition-all duration-500"
                  style={{ width: `${(lines / maxLines) * 100}%` }}
                />
              </div>
              <span className="text-pink-300 shrink-0 w-10 text-right">{lines}</span>
            </div>
            <span className="col-span-2 text-right text-slate-400">{funcs}</span>
            <span className="col-span-2 text-right text-slate-500">
              {bytes < 1024 ? `${bytes}B` : `${(bytes / 1024).toFixed(1)}KB`}
            </span>
          </div>
        ))}
        {filteredMetrics.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-xs font-mono">No files match "{searchQuery}"</div>
        )}
      </div>
    </div>
  );
};

export default memo(FilesTab);
