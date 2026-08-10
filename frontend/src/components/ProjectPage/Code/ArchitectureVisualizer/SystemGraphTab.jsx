import { memo } from "react";
import { Sparkles, X, FileCode } from "lucide-react";
import { NODE_STYLES, getExtColor } from "./constants";

const SystemGraphTab = ({
  graphNodes,
  dynamicApiRoutes,
  parsedDependencies,
  hasSocket,
  hasDatabase,
  selectedNode,
  setSelectedNode,
}) => {
  const has = (id) => graphNodes.some((n) => n.id === id);

  const getPos = (id) => {
    if (!hasSocket && !hasDatabase) {
      if (id === "client") return { cx: 230, cy: 215, w: 168, h: 130 };
      if (id === "server") return { cx: 690, cy: 215, w: 168, h: 130 };
    }
    if (!hasSocket) {
      if (id === "client")   return { cx: 160, cy: 215, w: 162, h: 130 };
      if (id === "server")   return { cx: 460, cy: 215, w: 162, h: 130 };
      if (id === "database") return { cx: 760, cy: 215, w: 162, h: 130 };
    }
    if (!hasDatabase) {
      if (id === "client") return { cx: 160, cy: 215, w: 162, h: 130 };
      if (id === "server") return { cx: 580, cy: 138, w: 162, h: 120 };
      if (id === "socket") return { cx: 580, cy: 292, w: 162, h: 120 };
    }
    if (id === "client")   return { cx: 140, cy: 215, w: 158, h: 130 };
    if (id === "server")   return { cx: 460, cy: 130, w: 162, h: 118 };
    if (id === "socket")   return { cx: 460, cy: 310, w: 162, h: 116 };
    if (id === "database") return { cx: 780, cy: 215, w: 158, h: 124 };
    return { cx: 460, cy: 215, w: 150, h: 120 };
  };

  const cPos = (id) => getPos(id);

  const connections = [
    { from: "client", to: "server",   label: "HTTP / REST", stroke: "#60a5fa", grad: "line-blue-purple",    arrow: "arrow-blue",     speed: "svg-flow",      fx: cPos("client").cx + cPos("client").w/2, fy: cPos("client").cy - 20, cx1: cPos("client").cx + 100, cy1: cPos("server").cy, cx2: cPos("server").cx - 100, cy2: cPos("server").cy, tx: cPos("server").cx - cPos("server").w/2, ty: cPos("server").cy, lx: (cPos("client").cx + cPos("server").cx)/2 - 36, ly: Math.min(cPos("client").cy, cPos("server").cy) - 22, lw: 72 },
    { from: "client", to: "socket",   label: "WS Events",   stroke: "#22d3ee", grad: "line-blue-cyan",      arrow: "arrow-cyan",     speed: "svg-flow-slow", fx: cPos("client").cx + cPos("client").w/2, fy: cPos("client").cy + 20, cx1: cPos("client").cx + 100, cy1: cPos("socket").cy, cx2: cPos("socket").cx - 100, cy2: cPos("socket").cy, tx: cPos("socket").cx - cPos("socket").w/2, ty: cPos("socket").cy, lx: (cPos("client").cx + cPos("socket").cx)/2 - 34, ly: Math.max(cPos("client").cy, cPos("socket").cy) + 8,  lw: 68 },
    { from: "server", to: "database", label: "DB Queries",  stroke: "#c084fc", grad: "line-purple-emerald", arrow: "arrow-purple",   speed: "svg-flow",      fx: cPos("server").cx + cPos("server").w/2, fy: cPos("server").cy, cx1: cPos("server").cx + 100, cy1: cPos("server").cy, cx2: cPos("database").cx - 100, cy2: cPos("database").cy, tx: cPos("database").cx - cPos("database").w/2, ty: cPos("database").cy - 20, lx: (cPos("server").cx + cPos("database").cx)/2 - 32, ly: cPos("server").cy - 20, lw: 64 },
    { from: "socket", to: "database", label: "Sessions",    stroke: "#34d399", grad: "line-cyan-emerald",   arrow: "arrow-emerald",  speed: "svg-flow-slow", fx: cPos("socket").cx + cPos("socket").w/2, fy: cPos("socket").cy, cx1: cPos("socket").cx + 100, cy1: cPos("socket").cy, cx2: cPos("database").cx - 100, cy2: cPos("database").cy, tx: cPos("database").cx - cPos("database").w/2, ty: cPos("database").cy + 20, lx: (cPos("socket").cx + cPos("database").cx)/2 - 28, ly: cPos("socket").cy + 6,  lw: 56 },
  ];

  const halos = graphNodes.map((n) => {
    const p = getPos(n.id);
    const colorMap = { client: "#3b82f6", server: "#9333ea", socket: "#06b6d4", database: "#10b981" };
    return (
      <circle key={n.id} cx={p.cx} cy={p.cy} r="70" fill={colorMap[n.id] || "#3b82f6"} fillOpacity="0.04" className="svg-node-glow" />
    );
  });

  const renderNode = (node) => {
    const p = getPos(node.id);
    const isSelected = selectedNode?.id === node.id;
    const x = p.cx - p.w / 2;
    const y = p.cy - p.h / 2;
    const gradMap = { client: "url(#grad-blue)", server: "url(#grad-purple)", socket: "url(#grad-cyan)", database: "url(#grad-emerald)" };
    const strokeMap = { client: "#1e3a5f", server: "#3b1f6e", socket: "#0e4f5c", database: "#065f46" };
    const selStrokeMap = { client: "#60a5fa", server: "#c084fc", socket: "#22d3ee", database: "#34d399" };
    const emojiMap = { client: "🌐", server: "🖥️", socket: "📡", database: "🗄️" };

    const filesToShow = node.files.slice(0, 2);

    return (
      <g
        key={node.id}
        transform={`translate(${x},${y})`}
        onClick={() => setSelectedNode(isSelected ? null : node)}
        style={{ cursor: "pointer" }}
        filter="url(#nodeshadow)"
      >
        <rect
          width={p.w} height={p.h} rx="16"
          fill={gradMap[node.id]}
          stroke={isSelected ? selStrokeMap[node.id] : strokeMap[node.id]}
          strokeWidth={isSelected ? 2 : 1.2}
        />
        {isSelected && (
          <rect width={p.w} height={p.h} rx="16" fill="none" stroke={selStrokeMap[node.id]} strokeWidth="4" opacity="0.15" />
        )}
        <rect x="12" y="12" width="32" height="32" rx="8" fill="#0f172a" stroke={selStrokeMap[node.id]} strokeWidth="0.6" fillOpacity="0.8" />
        <text x="28" y="34" textAnchor="middle" fontSize="16">{emojiMap[node.id]}</text>

        <rect x={p.w - 68} y="14" width="56" height="15" rx="7" fill="#0f172a" stroke="#334155" strokeWidth="0.6" />
        <text x={p.w - 40} y="24.5" textAnchor="middle" fill="#94a3b8" fontSize="7.5" fontFamily="monospace" fontWeight="700">
          {node.badge?.slice(0, 10)}
        </text>

        <text x="12" y="59" fill="#f1f5f9" fontSize="11" fontFamily="sans-serif" fontWeight="700">{node.title}</text>
        <text x="12" y="73" fill="#64748b" fontSize="8.5" fontFamily="monospace">{node.subtitle}</text>
        <line x1="12" y1="81" x2={p.w - 12} y2="81" stroke="#1e293b" strokeWidth="1" />

        {filesToShow.map((f, i) => {
          const name = f.split("/").pop().slice(0, 18);
          const fw = Math.min(p.w - 24, name.length * 6 + 14);
          return (
            <g key={f} transform={`translate(12,${90 + i * 15})`}>
              <rect width={fw} height="12" rx="3" fill="#0f172a" stroke="#1e293b" strokeWidth="0.8" />
              <text x="5" y="9" fill="#94a3b8" fontSize="8" fontFamily="monospace">{name}</text>
            </g>
          );
        })}
        {node.files.length > 2 && (
          <text x="12" y={p.h - 6} fill="#475569" fontSize="8" fontFamily="monospace">+{node.files.length - 2} more files</text>
        )}
      </g>
    );
  };

  const legendItems = graphNodes.map((n, i) => {
    const colors = { client: "#60a5fa", server: "#c084fc", socket: "#22d3ee", database: "#34d399" };
    const labels = { client: "Client", server: "API Server", socket: "WebSocket", database: "Database" };
    const offset = i * 90;
    return (
      <g key={n.id}>
        <circle cx={30 + offset} cy="411" r="4" fill={colors[n.id]} opacity="0.8" />
        <text x={40 + offset} y="415" fill="#64748b" fontSize="9" fontFamily="monospace">{labels[n.id]}</text>
      </g>
    );
  });

  return (
    <div className="space-y-4">
      <div className="relative rounded-3xl border border-purple-500/20 bg-[#05070f] shadow-2xl overflow-hidden">
        <style>{`
          @keyframes flowdash { to { stroke-dashoffset: -24; } }
          @keyframes nodeglow { 0%,100%{opacity:.5} 50%{opacity:1} }
          .svg-flow { animation: flowdash 1.2s linear infinite; }
          .svg-flow-slow { animation: flowdash 2s linear infinite; }
          .svg-node-glow { animation: nodeglow 3s ease-in-out infinite; }
        `}</style>

        <svg viewBox="0 0 920 430" className="w-full" style={{ minHeight: 240 }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="archgrid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="#1e293b" />
            </pattern>
            <filter id="nodeshadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.5" />
            </filter>
            {[["arrow-blue","#60a5fa"],["arrow-cyan","#22d3ee"],["arrow-purple","#c084fc"],["arrow-emerald","#34d399"]].map(([id,fill]) => (
              <marker key={id} id={id} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill={fill} />
              </marker>
            ))}
            <linearGradient id="grad-blue"    x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0c1a32"/><stop offset="100%" stopColor="#0a1225"/></linearGradient>
            <linearGradient id="grad-purple"  x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#110d26"/><stop offset="100%" stopColor="#0d0b1f"/></linearGradient>
            <linearGradient id="grad-cyan"    x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#071822"/><stop offset="100%" stopColor="#060f18"/></linearGradient>
            <linearGradient id="grad-emerald" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#071a12"/><stop offset="100%" stopColor="#05110c"/></linearGradient>

            <linearGradient id="line-blue-purple"   x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8"/><stop offset="100%" stopColor="#c084fc" stopOpacity="0.8"/></linearGradient>
            <linearGradient id="line-blue-cyan"     x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8"/><stop offset="100%" stopColor="#22d3ee" stopOpacity="0.8"/></linearGradient>
            <linearGradient id="line-purple-emerald"x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#c084fc" stopOpacity="0.8"/><stop offset="100%" stopColor="#34d399" stopOpacity="0.8"/></linearGradient>
            <linearGradient id="line-cyan-emerald"  x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8"/><stop offset="100%" stopColor="#34d399" stopOpacity="0.8"/></linearGradient>
          </defs>

          <rect width="920" height="430" fill="url(#archgrid)" />
          {halos}
          {connections.filter(c => has(c.from) && has(c.to)).map((c, i) => {
            const d = `M ${c.fx},${c.fy} C ${c.cx1},${c.cy1} ${c.cx2},${c.cy2} ${c.tx},${c.ty}`;
            return (
              <g key={i}>
                <path d={d} stroke={c.stroke} strokeWidth="6" fill="none" opacity="0.07" />
                <path d={d} stroke={`url(#${c.grad})`} strokeWidth="1.5" fill="none" opacity="0.5" />
                <path d={d} stroke={c.stroke} strokeWidth="2" fill="none" strokeDasharray="8 6" opacity="0.9" className={c.speed} markerEnd={`url(#${c.arrow})`} />
                <rect x={c.lx} y={c.ly} width={c.lw} height="15" rx="5" fill="#0a0d1a" stroke={c.stroke} strokeWidth="0.6" fillOpacity="0.92" />
                <text x={c.lx + c.lw / 2} y={c.ly + 10} textAnchor="middle" fill={c.stroke} fontSize="8.5" fontFamily="monospace" fontWeight="600">{c.label}</text>
              </g>
            );
          })}

          {graphNodes.map(renderNode)}
          {legendItems}
          <text x="900" y="415" textAnchor="end" fill="#334155" fontSize="9" fontFamily="monospace">{graphNodes.length} nodes · {dynamicApiRoutes.length} routes · {parsedDependencies.length} deps</text>
        </svg>

        <div className="px-5 py-3 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span className="flex items-center gap-1.5 text-cyan-300/60">
            <Sparkles size={11} className="text-cyan-400" />
            Click any node to inspect source files · Dashed lines = live data flow
          </span>
          <span className="text-slate-600 flex items-center gap-1">
            {!hasSocket && <span className="text-amber-500/60">Socket.io not detected in deps</span>}
            {!hasDatabase && <span className="text-amber-500/60 ml-2">No schema files found</span>}
          </span>
        </div>
      </div>

      {selectedNode && (
        <div className="rounded-2xl border border-purple-500/30 bg-slate-950/95 shadow-2xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/60">
            <div className="flex items-center gap-2.5">
              <selectedNode.icon size={15} className={NODE_STYLES[selectedNode.color]?.label || "text-slate-300"} />
              <span className="text-sm font-bold text-white">{selectedNode.title}</span>
              <span className="text-[10px] font-mono text-slate-300 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-md">{selectedNode.files.length} files</span>
            </div>
            <button type="button" onClick={() => setSelectedNode(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer">
              <X size={14} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 p-4 max-h-44 overflow-y-auto">
            {selectedNode.files.map((f) => (
              <div key={f} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-slate-900 border-slate-800 text-[11px] font-mono hover:bg-slate-800 transition">
                <FileCode size={11} className={getExtColor(f)} />
                <span className="text-slate-200">{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(SystemGraphTab);
