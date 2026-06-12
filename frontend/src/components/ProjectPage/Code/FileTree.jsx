import { memo, useMemo } from "react";
import { Folder, FolderOpen, FileCode2 } from "lucide-react";
import { isFileNode, normalizeFileTree } from "../../../utils/fileTree";

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
          className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-sm transition-colors
            ${isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700/40"}
            ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
        >
          <FileCode2 size={16} className="flex-shrink-0 text-blue-400" />
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
          className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-sm text-gray-300
            ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-gray-700/30"}`}
        >
          {isOpen ? (
            <FolderOpen size={16} className="flex-shrink-0 text-yellow-400" />
          ) : (
            <Folder size={16} className="flex-shrink-0 text-yellow-400" />
          )}
          <span className="truncate">{name}</span>
        </button>

        {isOpen && (
          <div className="ml-4 border-l border-gray-700 pl-3">
            <TreeNodes
              node={value}
              basePath={fullPath}
              activeFile={activeFile}
              disabled={disabled}
              openFolders={openFolders}
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
    <aside className="h-full w-full overflow-y-auto border-r border-gray-700 bg-gray-900/40 p-3">
      <h2 className="mb-3 select-none p-2 text-sm font-medium tracking-wide text-gray-200">
        FILES
      </h2>

      {isEmpty ? (
        <div className="select-none px-2 py-2 text-sm italic text-gray-500">
          No files
        </div>
      ) : (
        <div className="space-y-1">
          <TreeNodes
            node={normalizedTree}
            basePath=""
            activeFile={activeFile}
            disabled={disabled}
            openFolders={openFolders}
            onFileSelect={onFileSelect}
            onFolderToggle={handleFolderToggle}
          />
        </div>
      )}
    </aside>
  );
};

export default memo(FileTree);
