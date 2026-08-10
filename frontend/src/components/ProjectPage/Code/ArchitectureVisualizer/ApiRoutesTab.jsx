import { memo } from "react";
import { Route } from "lucide-react";
import { METHOD_STYLES } from "./constants";

const ApiRoutesTab = ({ dynamicApiRoutes }) => {
  return (
    <div className="rounded-3xl border border-emerald-500/25 bg-slate-950/70 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-emerald-950/15">
        <div className="flex items-center gap-2.5">
          <Route size={18} className="text-emerald-400" />
          <div>
            <h4 className="text-sm font-bold text-emerald-200">API Route Blueprint</h4>
            <p className="text-[10px] text-slate-400">Parsed from project source files</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-lg font-bold">
          {dynamicApiRoutes.length} Routes
        </span>
      </div>

      {/* Method Legend */}
      <div className="flex flex-wrap gap-2 px-5 py-3 border-b border-slate-800/60 bg-slate-900/40">
        {["GET", "POST", "PUT", "PATCH", "DELETE", "WS"].map((m) => (
          <span key={m} className={`px-2 py-0.5 rounded border text-[9px] font-mono font-bold ${METHOD_STYLES[m]}`}>{m}</span>
        ))}
      </div>

      {/* Route Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 border-b border-slate-800/60">
        {["GET", "POST", "WS", "DELETE"].map((m) => {
          const count = dynamicApiRoutes.filter((r) => r.method === m).length;
          return (
            <div key={m} className={`rounded-xl border p-3 flex flex-col gap-1 ${METHOD_STYLES[m]}`}>
              <span className="text-[9px] font-mono font-bold">{m}</span>
              <span className="text-xl font-bold font-mono">{count}</span>
              <span className="text-[9px] opacity-70">routes</span>
            </div>
          );
        })}
      </div>

      <div className="divide-y divide-slate-800/50 max-h-[380px] overflow-y-auto">
        {dynamicApiRoutes.map((r, idx) => (
          <div key={idx} className="flex items-center justify-between px-5 py-3 hover:bg-slate-900/60 transition text-xs font-mono">
            <div className="flex items-center gap-3 min-w-0">
              <span className={`px-2.5 py-0.5 rounded border text-[9px] font-extrabold shrink-0 ${METHOD_STYLES[r.method] || "bg-slate-700 text-slate-300 border-slate-600"}`}>
                {r.method}
              </span>
              <span className="font-bold text-white truncate">{r.path}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 shrink-0">
              <span className="text-slate-300 font-semibold">{r.file}</span>
              <span className={`px-2 py-0.5 rounded-md border text-[9px] ${r.type === "WebSocket" ? "bg-purple-500/15 border-purple-400/30 text-purple-300" : "bg-slate-800 border-slate-700 text-slate-400"}`}>
                {r.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(ApiRoutesTab);
