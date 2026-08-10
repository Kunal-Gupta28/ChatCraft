import { memo } from "react";
import {
  FileCode, Code2, Zap, Route, Package, Link2, Gauge, CheckCircle2, AlertCircle,
  BarChart3, Activity, Workflow, Globe, Cpu, Radio, Database, ChevronRight,
} from "lucide-react";

// Stat Card
const StatCard = ({ icon: Icon, label, value, color = "cyan" }) => {
  const colorStyles = {
    cyan:    "border-cyan-500/30 text-cyan-400 bg-cyan-500/10",
    purple:  "border-purple-500/30 text-purple-400 bg-purple-500/10",
    amber:   "border-amber-500/30 text-amber-400 bg-amber-500/10",
    emerald: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    pink:    "border-pink-500/30 text-pink-400 bg-pink-500/10",
    blue:    "border-blue-500/30 text-blue-400 bg-blue-500/10",
  }[color] || "border-slate-700 text-slate-300 bg-slate-800/50";

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-3.5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{label}</span>
        <div className={`p-1.5 rounded-lg border ${colorStyles}`}>
          <Icon size={13} />
        </div>
      </div>
      <span className="text-lg font-extrabold text-white tracking-tight">{value}</span>
    </div>
  );
};

// Health Progress Ring (SVG)
const HealthRing = ({ score = 80 }) => {
  const radius = 32;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const color = score >= 80 ? "#34d399" : score >= 60 ? "#facc15" : "#f87171";

  return (
    <div className="relative flex items-center justify-center shrink-0">
      <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
        <circle
          stroke="#1e293b"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: "stroke-dashoffset 0.8s ease" }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-sm font-extrabold text-white">{score}</span>
        <span className="text-[8px] font-mono text-slate-500 uppercase">/100</span>
      </div>
    </div>
  );
};

// Donut chart (SVG-based)
const DonutChart = ({ segments, size = 80 }) => {
  const radius = 30;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
      {segments.map((seg, i) => {
        const pct = seg.value / total;
        const dash = pct * circumference;
        const gap  = circumference - dash;
        const el = (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={seg.stroke}
            strokeWidth={10}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset * circumference}
            strokeLinecap="butt"
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
        );
        offset += pct;
        return el;
      })}
      <circle cx={cx} cy={cy} r={25} fill="#06090f" />
    </svg>
  );
};

const OverviewTab = ({
  stats,
  dynamicApiRoutes,
  parsedDependencies,
  importMap,
  healthScore,
  files,
  fileMetrics,
  langDist,
  donutSegments,
  arch,
  graphNodes,
  setViewMode,
}) => {
  const maxLines = Math.max(...fileMetrics.map((m) => m.lines), 1);

  return (
    <div className="space-y-4">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard icon={FileCode}   label="Total Files"      value={stats.fileCount}                                  color="cyan"    />
        <StatCard icon={Code2}      label="Lines of Code"    value={stats.totalLines.toLocaleString()}                color="purple"  />
        <StatCard icon={Zap}        label="Functions/Classes" value={stats.totalFuncs}                                color="amber"   />
        <StatCard icon={Route}      label="API Routes"       value={dynamicApiRoutes.length}                          color="emerald" />
        <StatCard icon={Package}    label="Dependencies"      value={parsedDependencies.length}                        color="pink"    />
        <StatCard icon={Link2}      label="Import Links"     value={Object.values(importMap).reduce((a,b)=>a+b.length,0)} color="blue"    />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Health Score */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Gauge size={15} className="text-cyan-400" />
            <span className="text-sm font-bold text-white">Project Health Score</span>
          </div>
          <div className="flex items-center gap-5">
            <HealthRing score={healthScore} />
            <div className="flex flex-col gap-2">
              {[
                { label: "Has package.json",  ok: parsedDependencies.length > 0 },
                { label: "Config / .env",      ok: files.some(f => f.includes("config") || f.includes(".env")) },
                { label: "API Routes parsed",  ok: dynamicApiRoutes.length > 2 },
                { label: "Functions detected", ok: fileMetrics.some(m => m.funcs > 2) },
                { label: "Documentation",      ok: files.some(f => f.endsWith(".md")) },
              ].map(({ label, ok }) => (
                <div key={label} className="flex items-center gap-2 text-[10px] font-mono">
                  {ok
                    ? <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                    : <AlertCircle  size={12} className="text-slate-600 shrink-0" />}
                  <span className={ok ? "text-slate-200" : "text-slate-500"}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Language Distribution Donut */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 size={15} className="text-purple-400" />
            <span className="text-sm font-bold text-white">Language Distribution</span>
          </div>
          <div className="flex items-center gap-5">
            <DonutChart segments={donutSegments} size={90} />
            <div className="flex flex-col gap-1.5 flex-1">
              {langDist.slice(0, 6).map((d) => (
                <div key={d.ext} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${d.bg}`} />
                  <span className="text-[10px] font-mono text-slate-300 flex-1">{d.label}</span>
                  <span className="text-[10px] font-mono text-slate-400">{d.count}</span>
                  <div className="w-12 h-1 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${d.bg}`}
                      style={{ width: `${(d.count / stats.fileCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hotspots */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={15} className="text-amber-400" />
              <span className="text-sm font-bold text-white">Hotspot Files</span>
            </div>
            <span className="text-[9px] font-mono text-slate-500">by line count</span>
          </div>
          <div className="space-y-2">
            {fileMetrics.slice(0, 4).map((m) => (
              <div key={m.fp} className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-300 truncate max-w-[170px]">{m.fp}</span>
                  <span className="text-slate-400">{m.lines} lines</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                    style={{ width: `${(m.lines / maxLines) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Architecture Flow at a Glance */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Workflow size={15} className="text-cyan-400" />
            <span className="text-sm font-bold text-white">System Architecture at a Glance</span>
          </div>
          <button
            type="button"
            onClick={() => setViewMode("graph")}
            className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
          >
            <span>Interactive Graph View</span>
            <ChevronRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1">
          {[
            { title: "Frontend Client", icon: Globe, color: "text-blue-400 bg-blue-500/10 border-blue-400/30", count: `${arch.frontend.length} files`, desc: "React / HTML / UI" },
            { title: "API Server", icon: Cpu, color: "text-purple-400 bg-purple-500/10 border-purple-400/30", count: `${dynamicApiRoutes.filter(r=>r.method!=="WS").length} endpoints`, desc: "Node.js Controller" },
            { title: "WebSocket Engine", icon: Radio, color: "text-cyan-400 bg-cyan-500/10 border-cyan-400/30", count: `${dynamicApiRoutes.filter(r=>r.method==="WS").length} WS events`, desc: "Socket.io real-time" },
            { title: "Data Store", icon: Database, color: "text-emerald-400 bg-emerald-500/10 border-emerald-400/30", count: `${arch.models.length} schemas`, desc: "MongoDB / Storage" },
          ].map((c) => (
            <div key={c.title} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 flex items-start gap-3">
              <div className={`p-2 rounded-lg border ${c.color} shrink-0`}>
                <c.icon size={15} />
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="text-xs font-bold text-white truncate">{c.title}</h5>
                <p className="text-[10px] font-mono text-cyan-300 font-semibold">{c.count}</p>
                <p className="text-[9px] font-mono text-slate-500 mt-0.5">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(OverviewTab);
