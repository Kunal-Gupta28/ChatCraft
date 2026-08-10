import { memo, useMemo, useState } from "react";
import { flattenFileTree } from "../../../../utils/fileTree";
import { FILE_TYPE_COLORS, KNOWN_TECH } from "./constants";
import VisualizerHeader from "./VisualizerHeader";
import OverviewTab from "./OverviewTab";
import SystemGraphTab from "./SystemGraphTab";
import ThreeTierTab from "./ThreeTierTab";
import ApiRoutesTab from "./ApiRoutesTab";
import ImportsTab from "./ImportsTab";
import FilesTab from "./FilesTab";
import DependenciesTab from "./DependenciesTab";

const ArchitectureVisualizer = ({ fileTree }) => {
  const [viewMode, setViewMode]         = useState("overview");
  const [searchQuery, setSearchQuery]   = useState("");
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredFile, setHoveredFile]   = useState(null);

  const fileContents = useMemo(() => flattenFileTree(fileTree || {}), [fileTree]);
  const files = useMemo(() => Object.keys(fileContents), [fileContents]);

  const fileMetrics = useMemo(() => {
    return files.map((fp) => {
      const text = fileContents[fp] || "";
      const lines = text ? text.split("\n").length : 1;
      const bytes = new Blob([text]).size;
      const funcMatches = text.match(/(?:function\s+\w+|const\s+\w+\s*=\s*(?:\([^)]*\)|async|\w+)\s*=>|class\s+\w+)/g);
      const funcs = funcMatches ? funcMatches.length : 0;
      return { fp, lines, bytes, funcs };
    }).sort((a, b) => b.lines - a.lines);
  }, [files, fileContents]);

  const arch = useMemo(() => {
    const frontend = files.filter(f => f.startsWith("src/") || f.startsWith("public/") || f.endsWith(".jsx") || f.endsWith(".tsx") || f.endsWith(".css") || f.endsWith(".html"));
    const server   = files.filter(f => f.includes("server") || f.includes("controllers") || f.includes("routes") || f.includes("middleware") || f.includes("api") || f.includes("services"));
    const models   = files.filter(f => f.includes("models") || f.includes("schemas") || f.includes("db") || f.includes("prisma"));
    const utils    = files.filter(f => f.includes("utils") || f.includes("helpers") || f.includes("config"));
    return { frontend, server, models, utils };
  }, [files]);

  const parsedDependencies = useMemo(() => {
    const pkgPath = files.find((f) => f.endsWith("package.json"));
    if (!pkgPath) return [];
    try {
      const content = fileContents[pkgPath] || "{}";
      const pkg = JSON.parse(content);
      const deps = Object.entries(pkg.dependencies || {}).map(([name, version]) => ({ name, version, dev: false }));
      const devDeps = Object.entries(pkg.devDependencies || {}).map(([name, version]) => ({ name, version, dev: true }));
      return [...deps, ...devDeps];
    } catch {
      return [];
    }
  }, [files, fileContents]);

  const hasSocket = useMemo(() => {
    return parsedDependencies.some((d) => d.name.toLowerCase().includes("socket.io"));
  }, [parsedDependencies]);

  const hasDatabase = useMemo(() => arch.models.length > 0, [arch.models]);

  const stats = useMemo(() => {
    const fileCount = files.length;
    const totalLines = fileMetrics.reduce((sum, m) => sum + m.lines, 0);
    const totalBytes = fileMetrics.reduce((sum, m) => sum + m.bytes, 0);
    const totalFuncs = fileMetrics.reduce((sum, m) => sum + m.funcs, 0);
    return { fileCount, totalLines, totalBytes, totalFuncs };
  }, [files, fileMetrics]);

  const langDist = useMemo(() => {
    const dist = {};
    files.forEach((fp) => {
      const ext = fp.split(".").pop() || "other";
      dist[ext] = (dist[ext] || 0) + (fileContents[fp]?.split("\n").length || 1);
    });
    return Object.entries(dist).map(([ext, lines]) => ({ ext, lines })).sort((a, b) => b.lines - a.lines);
  }, [files, fileContents]);

  const donutSegments = useMemo(() => {
    const total = stats.totalLines || 1;
    let accumulated = 0;
    return langDist.map(({ ext, lines }) => {
      const pct = (lines / total) * 100;
      const startAngle = (accumulated / total) * 360;
      accumulated += lines;
      const endAngle = (accumulated / total) * 360;
      const color = FILE_TYPE_COLORS[ext] || FILE_TYPE_COLORS.default;
      return { ext, lines, pct, startAngle, endAngle, color };
    });
  }, [langDist, stats.totalLines]);

  const dynamicApiRoutes = useMemo(() => {
    const routes = [];
    files.forEach((fp) => {
      const text = fileContents[fp] || "";
      const matches = text.matchAll(/(?:router|app)\.(get|post|put|delete|patch)\s*\(\s*["']([^"']+)["']/gi);
      for (const m of matches) {
        routes.push({ method: m[1].toUpperCase(), path: m[2], file: fp });
      }
    });
    return routes;
  }, [files, fileContents]);

  const importMap = useMemo(() => {
    const map = [];
    files.forEach((fp) => {
      const text = fileContents[fp] || "";
      const matches = text.matchAll(/import\s+(?:.*?\s+from\s+)?["']([^"']+)["']/g);
      for (const m of matches) {
        map.push({ source: fp, target: m[1] });
      }
    });
    return map;
  }, [files, fileContents]);

  const graphNodes = useMemo(() => {
    return files.map((fp) => {
      const text = fileContents[fp] || "";
      const lines = text ? text.split("\n").length : 1;
      const ext = fp.split(".").pop() || "js";
      return { id: fp, label: fp.split("/").pop(), path: fp, lines, ext };
    });
  }, [files, fileContents]);

  const healthScore = useMemo(() => {
    let score = 100;
    if (stats.fileCount === 0) return 0;
    const avgLines = stats.totalLines / stats.fileCount;
    if (avgLines > 200) score -= 15;
    if (!files.some(f => f.includes("README") || f.includes(".md"))) score -= 10;
    return Math.max(score, 40);
  }, [files, stats]);

  const detectedTech = useMemo(() => {
    return KNOWN_TECH.map(tech => ({
      ...tech,
      detected: parsedDependencies.some(d => d.name.toLowerCase().includes(tech.name.toLowerCase()))
    }));
  }, [parsedDependencies]);

  const filteredMetrics = useMemo(() => {
    if (!searchQuery.trim()) return fileMetrics;
    return fileMetrics.filter(m => m.fp.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [fileMetrics, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-[#06080e] overflow-y-auto select-none font-sans">
      <VisualizerHeader stats={stats} viewMode={viewMode} setViewMode={setViewMode} />

      <div className="flex-1 p-4 max-w-7xl mx-auto w-full space-y-4">
        {viewMode === "overview" && (
          <OverviewTab
            stats={stats} dynamicApiRoutes={dynamicApiRoutes} parsedDependencies={parsedDependencies}
            importMap={importMap} healthScore={healthScore} files={files} fileMetrics={fileMetrics}
            langDist={langDist} donutSegments={donutSegments} arch={arch} graphNodes={graphNodes} setViewMode={setViewMode}
          />
        )}

        {viewMode === "graph" && (
          <SystemGraphTab
            graphNodes={graphNodes} dynamicApiRoutes={dynamicApiRoutes} parsedDependencies={parsedDependencies}
            hasSocket={hasSocket} hasDatabase={hasDatabase} selectedNode={selectedNode} setSelectedNode={setSelectedNode}
          />
        )}

        {viewMode === "layers" && <ThreeTierTab arch={arch} fileMetrics={fileMetrics} />}
        {viewMode === "api" && <ApiRoutesTab dynamicApiRoutes={dynamicApiRoutes} />}
        {viewMode === "imports" && <ImportsTab importMap={importMap} />}
        {viewMode === "files" && (
          <FilesTab
            filteredMetrics={filteredMetrics} stats={stats} searchQuery={searchQuery}
            setSearchQuery={setSearchQuery} maxLines={Math.max(...fileMetrics.map((m) => m.lines), 1)}
            setHoveredFile={setHoveredFile}
          />
        )}
        {viewMode === "deps" && <DependenciesTab detectedTech={detectedTech} parsedDependencies={parsedDependencies} />}
      </div>
    </div>
  );
};

export default memo(ArchitectureVisualizer);
