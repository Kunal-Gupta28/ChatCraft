import { memo } from "react";
import { Link2, FileCode } from "lucide-react";
import { getExtColor } from "./constants";

const ImportRow = ({ file, imports }) => (
  <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
    <div className="flex items-center gap-2 mb-2">
      <FileCode size={13} className={getExtColor(file)} />
      <span className="text-[11px] font-semibold text-slate-200 font-mono truncate">{file}</span>
      <span className="ml-auto text-[10px] font-mono text-slate-500">{imports.length} imports</span>
    </div>
    <div className="flex flex-wrap gap-1">
      {imports.slice(0, 8).map((imp, i) => (
        <span key={i} className="px-1.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[9px] font-mono text-slate-300 flex items-center gap-1">
          <Link2 size={8} className="text-cyan-400" />
          {imp}
        </span>
      ))}
      {imports.length > 8 && (
        <span className="px-1.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[9px] font-mono text-slate-500">+{imports.length - 8}</span>
      )}
    </div>
  </div>
);

const ImportsTab = ({ importMap }) => {
  const entries = Object.entries(importMap);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-amber-500/25 bg-amber-950/15">
        <Link2 size={15} className="text-amber-400" />
        <div>
          <p className="text-xs font-bold text-amber-200">Import Dependency Map</p>
          <p className="text-[10px] text-slate-400 font-mono">Shows all imports/dependencies parsed per source file</p>
        </div>
        <span className="ml-auto text-[10px] font-mono text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-lg font-bold shrink-0">
          {entries.length} files with imports
        </span>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {entries.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs font-mono">No import statements found in project files</div>
        ) : (
          entries
            .sort(([, a], [, b]) => b.length - a.length)
            .map(([file, imports]) => (
              <ImportRow key={file} file={file} imports={imports} />
            ))
        )}
      </div>
    </div>
  );
};

export default memo(ImportsTab);
