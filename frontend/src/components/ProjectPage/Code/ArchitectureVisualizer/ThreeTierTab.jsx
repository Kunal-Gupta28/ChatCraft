import { memo } from "react";
import { Workflow, ArrowRight, Globe, Server, Database, FileCode } from "lucide-react";
import { getExtColor } from "./constants";

const ThreeTierTab = ({ arch, fileMetrics }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 px-1">
        <Workflow size={12} className="text-cyan-400" />
        <span className="text-blue-300">Client Layer</span>
        <ArrowRight size={10} className="text-slate-600" />
        <span className="text-purple-300">App Server Layer</span>
        <ArrowRight size={10} className="text-slate-600" />
        <span className="text-emerald-300">Data Store Layer</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Client Layer",     sub: `${arch.frontend.length} Frontend Files`, icon: Globe,    files: arch.frontend, border: "border-blue-500/30",    header: "bg-blue-950/25",    iconCl: "bg-blue-500/15 border-blue-400/30 text-blue-400",    tc: "text-blue-200" },
          { label: "App Server Layer", sub: `${arch.server.length} Backend Files`,   icon: Server,   files: arch.server,   border: "border-purple-500/30",  header: "bg-purple-950/25",  iconCl: "bg-purple-500/15 border-purple-400/30 text-purple-400", tc: "text-purple-200" },
          { label: "Data Store Layer", sub: `${arch.models.length} Schemas`,         icon: Database, files: arch.models,   border: "border-emerald-500/30", header: "bg-emerald-950/25", iconCl: "bg-emerald-500/15 border-emerald-400/30 text-emerald-400", tc: "text-emerald-200" },
        ].map(({ label, sub, icon: Icon, files: lf, border, header, iconCl, tc }) => (
          <div key={label} className={`flex flex-col rounded-2xl border ${border} bg-slate-950/60 overflow-hidden shadow-xl`}>
            <div className={`flex items-center gap-3 px-4 py-3.5 ${header} border-b border-slate-800`}>
              <div className={`p-2 rounded-xl border ${iconCl}`}><Icon size={16} /></div>
              <div>
                <h4 className={`text-xs font-bold ${tc} uppercase tracking-wider`}>{label}</h4>
                <p className="text-[10px] text-slate-400 font-mono">{sub}</p>
              </div>
            </div>
            <div className="space-y-2 p-3 max-h-60 overflow-y-auto flex-1">
              {lf.map((file) => (
                <div key={file} className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-300 hover:bg-slate-800/70 transition">
                  <FileCode size={12} className={getExtColor(file)} />
                  <span className="truncate flex-1">{file}</span>
                  {fileMetrics.find(m=>m.fp===file)?.lines > 0 && (
                    <span className="text-[9px] text-slate-500 shrink-0">{fileMetrics.find(m=>m.fp===file)?.lines}L</span>
                  )}
                </div>
              ))}
            </div>
            <div className="px-4 py-2 border-t border-slate-800/80 text-[9px] font-mono text-slate-500">{lf.length} files in this layer</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(ThreeTierTab);
