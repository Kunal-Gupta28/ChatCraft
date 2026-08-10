import { memo } from "react";
import { Shield, Package, Code2, Hash } from "lucide-react";
import { KNOWN_TECH } from "./constants";

const DependenciesTab = ({ detectedTech, parsedDependencies }) => {
  const prodDeps = parsedDependencies.filter((d) => !d.dev);
  const devDeps = parsedDependencies.filter((d) => d.dev);

  return (
    <div className="space-y-4">
      {detectedTech.length > 0 && (
        <div className="rounded-2xl border border-blue-500/25 bg-slate-950/80 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={15} className="text-blue-400" />
            <span className="text-sm font-bold text-blue-200">Recognised Tech Stack</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {detectedTech.map((t) => (
              <span key={t.key} className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono font-semibold ${t.color}`}>
                {t.label}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Prod deps */}
        <div className="rounded-2xl border border-slate-700/60 bg-slate-950/70 overflow-hidden shadow-xl">
          <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package size={14} className="text-emerald-400" />
              <span className="text-xs font-bold text-emerald-200">Production Deps</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">{prodDeps.length}</span>
          </div>
          <div className="divide-y divide-slate-800/40 max-h-64 overflow-y-auto">
            {prodDeps.map(({ name, version }) => {
              const tech = KNOWN_TECH.find((t) => name.toLowerCase().includes(t.key));
              return (
                <div key={name} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-800/60 transition text-xs font-mono">
                  <div className="flex items-center gap-2 min-w-0">
                    <Hash size={11} className={tech ? "text-cyan-400" : "text-slate-600"} />
                    <span className="text-slate-200 truncate font-semibold">{name}</span>
                  </div>
                  <span className="text-slate-400 shrink-0 ml-2 text-[10px]">{version}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dev deps */}
        <div className="rounded-2xl border border-slate-700/60 bg-slate-950/70 overflow-hidden shadow-xl">
          <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 size={14} className="text-amber-400" />
              <span className="text-xs font-bold text-amber-200">Dev Dependencies</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">{devDeps.length}</span>
          </div>
          <div className="divide-y divide-slate-800/40 max-h-64 overflow-y-auto">
            {devDeps.map(({ name, version }) => {
              const tech = KNOWN_TECH.find((t) => name.toLowerCase().includes(t.key));
              return (
                <div key={name} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-800/60 transition text-xs font-mono">
                  <div className="flex items-center gap-2 min-w-0">
                    <Hash size={11} className={tech ? "text-amber-400" : "text-slate-600"} />
                    <span className="text-slate-200 truncate font-semibold">{name}</span>
                  </div>
                  <span className="text-slate-400 shrink-0 ml-2 text-[10px]">{version}</span>
                </div>
              );
            })}
            {devDeps.length === 0 && (
              <div className="text-center py-6 text-slate-500 text-[10px] font-mono">No dev dependencies found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(DependenciesTab);
