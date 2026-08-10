import { memo, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderTree, FilePlus, FolderPlus, RotateCw, ArrowLeft, AlertTriangle, RefreshCw
} from "lucide-react";
import {
  normalizeFileTree, addFileToTree, renamePathInTree, deletePathFromTree, flattenFileTree
} from "../../../utils/fileTree";
import { useCodeEditor } from "../../../contexts/codeEditor.context";
import { useProject } from "../../../contexts/project.context";
import { emitSocketEvent } from "../../../config/socket";
import axiosInstance from "../../../config/axios";
import InlineInput from "./InlineInput";
import TreeNodes from "./TreeNodes";
import DeleteGuardModal from "./DeleteGuardModal";

const FileTree = ({
  tree, fileTree, activeFile, activeTab, openFolders, setOpenFolders,
  onFileSelect, onSelectFile, modifiedFiles = {}, isBehindMain = false, onSyncMain
}) => {
  const navigate = useNavigate();
  const { project } = useProject();
  const { setFileTree } = useCodeEditor();
  const effectiveTree = tree || fileTree;
  const handleFileSelect = onFileSelect || onSelectFile;
  const normalizedTree = useMemo(() => normalizeFileTree(effectiveTree), [effectiveTree]);
  const mainFileContentMap = useMemo(() => flattenFileTree(effectiveTree), [effectiveTree]);
  const disabled = activeTab === "preview";
  const isEmpty = Object.keys(normalizedTree).length === 0;

  const [selectedFolder, setSelectedFolder] = useState("");
  const [creatingState, setCreatingState] = useState(null);
  const [creatingValue, setCreatingValue] = useState("");
  const [editingPath, setEditingPath] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [deletingPath, setDeletingPath] = useState(null);

  const handleFolderToggle = (path) => {
    if (typeof setOpenFolders === "function") {
      setOpenFolders((current) => ({ ...current, [path]: current?.[path] !== undefined ? !current[path] : false }));
    }
  };

  const persistTreeUpdate = (nextTree) => {
    setFileTree(nextTree);
    if (project?._id) {
      emitSocketEvent("project-files-apply", { projectId: project._id, fileTree: nextTree });
      axiosInstance.put("/project/update-file-tree", { projectId: project._id, fileTree: nextTree }).catch(() => {});
    }
  };

  const handleCommitCreate = () => {
    const val = creatingValue.trim();
    if (!val || !creatingState) { setCreatingState(null); return; }

    const isFolder = creatingState.type === "folder";
    const rawPath = creatingState.parentPath ? `${creatingState.parentPath}/${val}` : val;
    const finalPath = isFolder ? (rawPath.endsWith("/") ? `${rawPath}.gitkeep` : `${rawPath}/.gitkeep`) : rawPath;

    const next = addFileToTree(effectiveTree, finalPath, isFolder ? "" : "// New file\n");
    persistTreeUpdate(next);
    if (!isFolder) handleFileSelect(finalPath);
    setCreatingState(null);
    setCreatingValue("");
  };

  const handleStartRename = (path, name) => {
    setEditingPath(path);
    setEditingValue(name);
  };

  const handleCommitRename = () => {
    if (!editingPath || !editingValue.trim()) { setEditingPath(null); return; }

    const parts = editingPath.split("/");
    parts[parts.length - 1] = editingValue.trim();
    const newPath = parts.join("/");

    if (newPath !== editingPath) {
      const next = renamePathInTree(effectiveTree, editingPath, newPath);
      persistTreeUpdate(next);
    }
    setEditingPath(null);
  };

  const confirmDeletePath = () => {
    if (!deletingPath) return;
    const next = deletePathFromTree(effectiveTree, deletingPath);
    persistTreeUpdate(next);
    setDeletingPath(null);
  };

  return (
    <aside className="h-full w-full overflow-y-auto border-r border-slate-800/80 bg-[#06080e] p-2.5 select-none backdrop-blur-xl flex flex-col justify-between font-sans">
      <div>
        {/* VS Code Style Header Toolbar */}
        <div className="flex items-center justify-between gap-1 px-1 mb-2.5 pb-2 border-b border-slate-800/80 h-9 shrink-0 select-none">
          <div className="flex items-center gap-1.5 truncate">
            <FolderTree size={14} className="text-blue-400 shrink-0" />
            <h2 className="text-[11px] font-extrabold tracking-wider text-slate-200 uppercase truncate">Explorer</h2>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => { setCreatingState({ type: "file", parentPath: "" }); setCreatingValue(""); }}
              title="New File in Root Directory"
              className="p-1 rounded-md hover:bg-slate-800/80 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <FilePlus size={14} />
            </button>
            <button
              type="button"
              onClick={() => { setCreatingState({ type: "folder", parentPath: "" }); setCreatingValue(""); }}
              title="New Folder in Root Directory"
              className="p-1 rounded-md hover:bg-slate-800/80 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <FolderPlus size={14} />
            </button>
            <button
              type="button"
              onClick={() => navigate(0)}
              title="Refresh Explorer"
              className="p-1 rounded-md hover:bg-slate-800/80 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <RotateCw size={13} />
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              title="Return to Dashboard"
              className="p-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 transition cursor-pointer"
            >
              <ArrowLeft size={13} />
            </button>
          </div>
        </div>

        {/* Behind Main Notification Banner */}
        {isBehindMain && (
          <div className="mb-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-1.5 font-mono text-[11px] text-amber-300">
            <div className="flex items-center gap-1.5 truncate">
              <AlertTriangle size={13} className="text-amber-400 shrink-0 animate-pulse" />
              <span className="truncate font-semibold">Behind Main</span>
            </div>
            <button
              type="button"
              onClick={onSyncMain}
              className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 border border-amber-500/40 font-bold transition cursor-pointer flex items-center gap-1 shrink-0"
            >
              <RefreshCw size={10} /> Sync
            </button>
          </div>
        )}

        {/* Root Inline Input Field */}
        {creatingState && !creatingState.parentPath && (
          <div className="mb-2 px-1">
            <InlineInput
              type={creatingState.type} value={creatingValue} onChange={setCreatingValue}
              onCommit={handleCommitCreate} onCancel={() => setCreatingState(null)}
            />
          </div>
        )}

        {/* Tree Nodes List */}
        {isEmpty && !creatingState ? (
          <div className="select-none px-2 py-3 text-xs italic text-slate-500 font-mono">No files created yet</div>
        ) : (
          <div className="space-y-0.5">
            <TreeNodes
              node={normalizedTree} basePath="" activeFile={activeFile} disabled={disabled} openFolders={openFolders}
              onFileSelect={handleFileSelect} onFolderToggle={handleFolderToggle} editingPath={editingPath}
              editingValue={editingValue} setEditingValue={setEditingValue} onCommitRename={handleCommitRename}
              onCancelRename={() => setEditingPath(null)} onStartRename={handleStartRename} onDeletePath={(path) => setDeletingPath(path)}
              creatingState={creatingState} setCreatingState={setCreatingState} creatingValue={creatingValue}
              setCreatingValue={setCreatingValue} onCommitCreate={handleCommitCreate} onCancelCreate={() => setCreatingState(null)}
              selectedFolder={selectedFolder} setSelectedFolder={setSelectedFolder}
              modifiedFiles={modifiedFiles} mainFileContentMap={mainFileContentMap}
            />
          </div>
        )}
      </div>

      <DeleteGuardModal deletingPath={deletingPath} onClose={() => setDeletingPath(null)} onConfirm={confirmDeletePath} />
    </aside>
  );
};

export default memo(FileTree);
