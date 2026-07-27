import { memo, useMemo } from "react";
import { Folder, FolderOpen, FileCode2, FileJson, FileText, Image as ImageIcon, File, Settings, Route, Database, Server, Layers, Package, Globe, Code2, PanelLeftOpen } from "lucide-react";
import { isFileNode, normalizeFileTree } from "../../../utils/fileTree";

const getFileIcon = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  switch (ext) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
    case 'html':
    case 'css':
      return <FileCode2 size={14} className="flex-shrink-0 text-blue-400" />;
    case 'json':
      return <FileJson size={14} className="flex-shrink-0 text-emerald-400" />;
    case 'md':
    case 'txt':
    case 'csv':
      return <FileText size={14} className="flex-shrink-0 text-slate-400" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'svg':
    case 'gif':
      return <ImageIcon size={14} className="flex-shrink-0 text-purple-400" />;
    default:
      return <File size={14} className="flex-shrink-0 text-slate-400" />;
  }
};

const getFolderIcon = (name, isOpen) => {
  const iconSize = 14;
  const folderName = name.toLowerCase();
  
  if (folderName === 'config') return <Settings size={iconSize} className="flex-shrink-0 text-slate-400" />;
  if (folderName === 'controllers') return <Code2 size={iconSize} className="flex-shrink-0 text-blue-400" />;
  if (folderName === 'models') return <Database size={iconSize} className="flex-shrink-0 text-emerald-400" />;
  if (folderName === 'routes') return <Route size={iconSize} className="flex-shrink-0 text-purple-400" />;
  if (folderName === 'services') return <Server size={iconSize} className="flex-shrink-0 text-amber-500" />;
  if (folderName === 'middlewares') return <Layers size={iconSize} className="flex-shrink-0 text-orange-400" />;
  if (folderName === 'node_modules') return <Package size={iconSize} className="flex-shrink-0 text-red-400" />;
  if (folderName === 'public') return <Globe size={iconSize} className="flex-shrink-0 text-cyan-400" />;
  if (folderName === 'src') return <FolderOpen size={iconSize} className="flex-shrink-0 text-indigo-400" />;

  return isOpen ? (
    <FolderOpen size={iconSize} className="flex-shrink-0 text-amber-400" />
  ) : (
    <Folder size={iconSize} className="flex-shrink-0 text-amber-400" />
  );
};

const TreeNodes = ({
  node,
  basePath,
  activeFile,
  disabled,
  openFolders,
  onFileSelect,
  onFolderToggle,
}) =>
  Object.entries(node).map(([name, value]) => {
    const fullPath = basePath ? `${basePath}/${name}` : name;

    if (isFileNode(value)) {
      const isActive = activeFile === fullPath;
      return (
        <button
          type="button"
          key={fullPath}
          disabled={disabled}
          onClick={() => onFileSelect(fullPath)}
          className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-xs transition-all font-mono border
            ${isActive ? "bg-blue-600/15 text-blue-300 font-medium border-blue-500/30" : "text-slate-300 hover:bg-slate-800/50 hover:text-white border-transparent"}
            ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
        >
          {getFileIcon(name)}
          <span className="truncate">{name}</span>
        </button>
      );
    }

    const isOpen = Boolean(openFolders[fullPath]);
    return (
      <div key={fullPath}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onFolderToggle(fullPath)}
          className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-xs font-mono text-slate-300 transition-all border border-transparent
            ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-slate-800/40 hover:text-white"}`}
        >
          {getFolderIcon(name, isOpen)}
          <span className="truncate font-medium">{name}</span>
        </button>

        {isOpen && (
          <div className="ml-3 border-l border-slate-800/80 pl-2 space-y-0.5 mt-0.5">
            <TreeNodes
              node={value}
              basePath={fullPath}
              activeFile={activeFile}
              disabled={disabled}
              openFolders={openFolders}
              setOpenFolders={setOpenFolders}
              onFileSelect={onFileSelect}
              onFolderToggle={onFolderToggle}
            />
          </div>
        )}
      </div>
    );
  });

const FileTree = ({
  tree,
  activeFile,
  activeTab,
  openFolders,
  setOpenFolders,
  onFileSelect,
  toggleChat,
  isChatVisible,
}) => {
  const normalizedTree = useMemo(() => normalizeFileTree(tree), [tree]);
  const disabled = activeTab === "preview";
  const isEmpty = Object.keys(normalizedTree).length === 0;

  const handleFolderToggle = (path) => {
    setOpenFolders((current) => ({
      ...current,
      [path]: !current[path],
    }));
  };

  return (
    <aside className="h-full w-full overflow-y-auto border-r border-slate-800/80 bg-[#090d16]/90 p-2.5 select-none backdrop-blur-xl">
      <div className="flex items-center gap-2 px-2 mb-2 pb-2 border-b border-slate-800/80 h-8 shrink-0 min-w-0">
        {!isChatVisible && toggleChat && (
          <button
            type="button"
            onClick={toggleChat}
            aria-label="Show Chat Sidebar"
            title="Show Chat Sidebar"
            className="p-1 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition cursor-pointer shadow-xs shrink-0 flex items-center justify-center"
          >
            <PanelLeftOpen size={14} />
          </button>
        )}

        <h2 className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase truncate">
          Explorer
        </h2>
      </div>

      {isEmpty ? (
        <div className="select-none px-2 py-3 text-xs italic text-slate-500 font-mono">
          No files created yet
        </div>
      ) : (
        <div className="space-y-0.5">
          <TreeNodes
            node={normalizedTree}
            basePath=""
            activeFile={activeFile}
            disabled={disabled}
            openFolders={openFolders}
            setOpenFolders={setOpenFolders}
            onFileSelect={onFileSelect}
            onFolderToggle={handleFolderToggle}
          />
        </div>
      )}
    </aside>
  );
};

export default memo(FileTree);
