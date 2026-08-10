import { useMemo } from "react";
import { FilePlus, FolderPlus, Trash2 } from "lucide-react";
import { isFileNode } from "../../../utils/fileTree";
import { getFileIcon, getFolderIcon } from "./fileIcons";
import InlineInput from "./InlineInput";

const TreeNodes = ({
  node, basePath, activeFile, disabled, openFolders, onFileSelect, onFolderToggle,
  editingPath, editingValue, setEditingValue, onCommitRename, onCancelRename, onStartRename,
  onDeletePath, creatingState, setCreatingState, creatingValue, setCreatingValue, onCommitCreate, onCancelCreate,
  selectedFolder, setSelectedFolder, modifiedFiles = {}, mainFileContentMap = {}
}) => {
  const sortedEntries = useMemo(() => {
    return Object.entries(node || {}).sort(([aName, aVal], [bName, bVal]) => {
      const aIsFile = isFileNode(aVal);
      const bIsFile = isFileNode(bVal);
      if (!aIsFile && bIsFile) return -1;
      if (aIsFile && !bIsFile) return 1;
      return aName.localeCompare(bName);
    });
  }, [node]);

  return sortedEntries.map(([name, value]) => {
    const fullPath = basePath ? `${basePath}/${name}` : name;
    const isEditing = editingPath === fullPath;

    if (isFileNode(value)) {
      const isActive = activeFile === fullPath;
      const isModified = modifiedFiles[fullPath] !== undefined;
      const isNewFile = mainFileContentMap[fullPath] === undefined;

      return (
        <div key={fullPath} className="group relative flex items-center w-full">
          {isEditing ? (
            <InlineInput type="file" value={editingValue} onChange={setEditingValue} onCommit={onCommitRename} onCancel={onCancelRename} />
          ) : (
            <button
              type="button"
              disabled={disabled}
              onClick={() => onFileSelect(fullPath)}
              onDoubleClick={(e) => { e.stopPropagation(); onStartRename(fullPath, name); }}
              className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-xs transition-all font-mono border
                ${isActive ? "bg-blue-600/15 text-blue-300 font-semibold border-blue-500/40 border-l-2 border-l-blue-400 shadow-sm" : "text-slate-300 hover:bg-slate-800/60 hover:text-white border-transparent"}
                ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
            >
              {getFileIcon(name)}
              <span className="truncate flex-1">{name}</span>
              {isModified && (
                <span className={`text-[10px] font-extrabold font-mono px-1 rounded shrink-0 ${
                  isNewFile ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30" : "text-amber-400 bg-amber-500/10 border border-amber-500/30"
                }`}>
                  {isNewFile ? "A" : "M"}
                </span>
              )}
              <span onClick={(e) => { e.stopPropagation(); onDeletePath(fullPath); }} title="Delete File" className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition cursor-pointer">
                <Trash2 size={12} />
              </span>
            </button>
          )}
        </div>
      );
    }

    const isOpen = Boolean(openFolders?.[fullPath] ?? true);
    const isSelected = selectedFolder === fullPath;
    const isCreatingHere = creatingState?.parentPath === fullPath;

    return (
      <div key={fullPath}>
        <div className="group relative flex items-center w-full">
          {isEditing ? (
            <InlineInput type="folder" value={editingValue} onChange={setEditingValue} onCommit={onCommitRename} onCancel={onCancelRename} />
          ) : (
            <button
              type="button"
              disabled={disabled}
              onClick={() => { setSelectedFolder(fullPath); onFolderToggle(fullPath); }}
              onDoubleClick={(e) => { e.stopPropagation(); onStartRename(fullPath, name); }}
              className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-xs font-mono transition-all border
                ${isSelected ? "bg-slate-800/90 text-white border-slate-700 font-semibold shadow-sm" : "text-slate-300 hover:bg-slate-800/40 hover:text-white border-transparent"}
                ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
            >
              {getFolderIcon(name, isOpen)}
              <span className="truncate font-medium flex-1">{name}</span>
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                <span onClick={(e) => { e.stopPropagation(); setCreatingState({ type: "file", parentPath: fullPath }); setCreatingValue(""); }} title={`New File inside ${name}`} className="p-0.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer">
                  <FilePlus size={12} />
                </span>
                <span onClick={(e) => { e.stopPropagation(); setCreatingState({ type: "folder", parentPath: fullPath }); setCreatingValue(""); }} title={`New Sub-Folder inside ${name}`} className="p-0.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer">
                  <FolderPlus size={12} />
                </span>
                <span onClick={(e) => { e.stopPropagation(); onDeletePath(fullPath); }} title="Delete Folder" className="p-0.5 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition cursor-pointer">
                  <Trash2 size={12} />
                </span>
              </div>
            </button>
          )}
        </div>

        {isOpen && (
          <div className="ml-3 border-l border-slate-800/80 pl-2 space-y-0.5 mt-0.5">
            {isCreatingHere && (
              <InlineInput
                type={creatingState.type} value={creatingValue} onChange={setCreatingValue}
                onCommit={onCommitCreate} onCancel={onCancelCreate}
              />
            )}
            <TreeNodes
              node={value} basePath={fullPath} activeFile={activeFile} disabled={disabled} openFolders={openFolders}
              onFileSelect={onFileSelect} onFolderToggle={onFolderToggle} editingPath={editingPath}
              editingValue={editingValue} setEditingValue={setEditingValue} onCommitRename={onCommitRename}
              onCancelRename={onCancelRename} onStartRename={onStartRename} onDeletePath={onDeletePath}
              creatingState={creatingState} setCreatingState={setCreatingState} creatingValue={creatingValue}
              setCreatingValue={setCreatingValue} onCommitCreate={onCommitCreate} onCancelCreate={onCancelCreate}
              selectedFolder={selectedFolder} setSelectedFolder={setSelectedFolder}
              modifiedFiles={modifiedFiles} mainFileContentMap={mainFileContentMap}
            />
          </div>
        )}
      </div>
    );
  });
};

export default TreeNodes;
