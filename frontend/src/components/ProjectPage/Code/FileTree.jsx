import { memo, useCallback } from "react";
import { Folder, FolderOpen, FileCode2 } from "lucide-react";

const FileTree = ({
  tree,
  activeFile,
  activeTab,
  openFolders,
  setOpenFolders,
  onFileSelect,
}) => {
  const isPreview = activeTab === "preview";
  const isEmpty = !tree || Object.keys(tree).length === 0;

  /** Toggle folder */
  const toggleFolder = useCallback((path) => {
    if (isPreview) return;

    setOpenFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  }, [isPreview, setOpenFolders]);

  /** Render a file */
  const FileItem = memo(({ name, fullPath }) => {
    const isActive = activeFile === fullPath;

    const handleClick = useCallback(() => {
      if (!isPreview) onFileSelect(fullPath);
    }, [isPreview, onFileSelect, fullPath]);

    return (
      <div
        onClick={handleClick}
        className={`flex items-center gap-2 py-1 px-2 rounded-md text-sm truncate transition-colors select-none
          ${
            isActive
              ? "bg-gray-700 text-white"
              : "hover:bg-gray-700/40 text-gray-300 cursor-pointer"
          }
          ${isPreview && "opacity-40 cursor-not-allowed"}
        `}
      >
        <FileCode2 size={16} className="text-blue-400 flex-shrink-0" />
        <span className="truncate">{name}</span>
      </div>
    );
  });

  /** Render a folder */
  const FolderItem = memo(({ name, value, fullPath }) => {
    const isOpen = openFolders[fullPath];

    const handleToggle = useCallback(() => {
      toggleFolder(fullPath);
    }, [toggleFolder, fullPath]);

    return (
      <div>
        {/* Folder header */}
        <div
          onClick={handleToggle}
          className={`flex items-center gap-2 py-1 px-2 rounded-md text-sm truncate select-none
            ${isPreview ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-700/30 cursor-pointer"}
            text-gray-300
          `}
        >
          {isOpen ? (
            <FolderOpen size={16} className="text-yellow-400" />
          ) : (
            <Folder size={16} className="text-yellow-400" />
          )}
          <span className="truncate">{name}</span>
        </div>

        {/* Render children */}
        {isOpen && (
          <div className="ml-4 border-l border-gray-700 pl-3">
            {renderTree(value, fullPath)}
          </div>
        )}
      </div>
    );
  });

  /** Recursively render tree structure */
  const renderTree = useCallback((node, base = "") => {
    return Object.entries(node).map(([name, value]) => {
      const fullPath = base ? `${base}/${name}` : name;

      return value.file ? (
        <FileItem key={fullPath} name={name} fullPath={fullPath} />
      ) : (
        <FolderItem
          key={fullPath}
          name={name}
          value={value}
          fullPath={fullPath}
        />
      );
    });
  }, [FileItem, FolderItem]);

  return (
    <aside className="h-full w-full border-r border-gray-700 bg-gray-900/40 overflow-y-auto p-3">
      {/* Heading text */}
      <h2 className="text-gray-200 font-medium text-sm mb-3 p-2 tracking-wide select-none">
        FILES
      </h2>

      {/* if file tree is Empty then show text otherwise show files */}
      {isEmpty ? (
        <div className="text-gray-500 text-sm px-2 py-2 italic select-none">
          No files in this project
        </div>
      ) : (
        <div className="space-y-1">{renderTree(tree)}</div>
      )}
    </aside>
  );
};

export default memo(FileTree);