import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Folder, CheckCircle, AlertCircle, Info, X } from "lucide-react";
import axiosInstance from "../../../../config/axios";
import { useProject } from "../../../../contexts/project.context";
import { useCodeEditor } from "../../../../contexts/codeEditor.context";
import { useUser } from "../../../../contexts/user.context";
import { emitSocketEvent } from "../../../../config/socket";
import { getWebContainer } from "../../../../config/webContainer";
import { applyFileChanges, flattenFileTree, toWebContainerTree } from "../../../../utils/fileTree";
import FileTree from "../FileTree";
import TabsBar from "../TabsBar";
import EditorPane from "../EditorPane";
import PreviewPane from "../PreviewPane";
import CodeDiffReview from "../CodeDiffReview";
import PullRequestModal from "../PullRequestModal";
import ArchitectureVisualizer from "../ArchitectureVisualizer";
import debounce from "../utils/debounce";
import { parseCommand, inferCommands, buildFallbackPreviewUrl } from "./previewUtils";
import { usePRManager } from "./usePRManager";

const CodeEditor = ({ toggleChat, isChatVisible, editorPresence = [] }) => {
  const { project } = useProject();
  const { user: currentUser } = useUser();
  const { fileTree, setFileTree, webContainer, setWebContainer, activeSuggestion, setActiveSuggestion } = useCodeEditor();
  const runProcessRef = useRef(null);
  const listenerCleanupRef = useRef([]);
  const presenceTimerRef = useRef(null);
  const pendingPresenceRef = useRef(null);

  const [openFiles, setOpenFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [code, setCode] = useState("");
  const [openFolders, setOpenFolders] = useState({});
  const [iframeUrl, setIframeUrl] = useState(null);
  const [activeTab, setActiveTab] = useState("code");
  const [isRunning, setIsRunning] = useState(false);
  const [runError, setRunError] = useState("");
  const [showFiles, setShowFiles] = useState(false);
  const [toast, setToast] = useState(null);

  const triggerToast = useCallback((message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const isOwner = Boolean(project?.users?.[0] && String(project.users[0]?._id || project.users[0]) === String(currentUser?._id));
  const fileContentMap = useMemo(() => flattenFileTree(fileTree), [fileTree]);
  const collaboratorPresence = useMemo(
    () => editorPresence.filter((p) => String(p.userId) !== String(currentUser?._id)),
    [currentUser?._id, editorPresence],
  );

  const {
    modifiedFiles, setModifiedFiles, isBehindMain, pendingPRs, isPRModalOpen,
    setIsPRModalOpen, handleSubmitPR, handleApprovePR, handleRejectPR, handleSyncMain, handleDiscardDraft
  } = usePRManager({ project, currentUser, isOwner, setFileTree, triggerToast });

  const emitEditorPresence = useCallback((filePath, cursor) => {
    emitSocketEvent("project-editor-presence", { filePath: filePath || null, cursor: cursor || undefined });
  }, []);

  const handleCursorChange = useCallback((cursor) => {
    if (!activeFile || !cursor) return;
    pendingPresenceRef.current = { filePath: activeFile, cursor };
    if (presenceTimerRef.current) return;
    presenceTimerRef.current = setTimeout(() => {
      const nextPresence = pendingPresenceRef.current;
      pendingPresenceRef.current = null;
      presenceTimerRef.current = null;
      if (nextPresence) emitEditorPresence(nextPresence.filePath, nextPresence.cursor);
    }, 75);
  }, [activeFile, emitEditorPresence]);

  const debouncedSave = useMemo(() => {
    if (!project?._id) return debounce(() => {}, 800);
    return debounce((path, content) => {
      if (isOwner) {
        axiosInstance.put("/project/update-file-tree", { projectId: project._id, updatedfile: path, newCode: content })
          .catch((err) => console.error("File save failed:", err));
      }
    }, 800);
  }, [isOwner, project?._id]);

  useEffect(() => () => debouncedSave.cancel?.(), [debouncedSave]);

  useEffect(() => {
    setModifiedFiles((curr) => {
      const updated = { ...curr };
      Object.keys(updated).forEach((fp) => {
        if (fileContentMap[fp] === undefined) delete updated[fp];
      });
      return updated;
    });

    setOpenFiles((curr) => curr.filter((fp) => fileContentMap[fp] !== undefined));
    setActiveFile((curr) => (curr && fileContentMap[curr] !== undefined ? curr : null));
  }, [fileContentMap, setModifiedFiles]);

  useEffect(() => {
    if (presenceTimerRef.current) {
      clearTimeout(presenceTimerRef.current);
      presenceTimerRef.current = null;
    }
    pendingPresenceRef.current = null;
    emitEditorPresence(activeFile, activeFile ? { lineNumber: 1, column: 1 } : undefined);
  }, [activeFile, emitEditorPresence]);

  useEffect(() => () => {
    if (presenceTimerRef.current) clearTimeout(presenceTimerRef.current);
    emitEditorPresence(null);
  }, [emitEditorPresence]);

  const openFile = useCallback((filePath) => {
    debouncedSave.cancel?.();
    setOpenFiles((curr) => (curr.includes(filePath) ? curr : [...curr, filePath]));
    setActiveFile(filePath);
    setShowFiles(false);
  }, [debouncedSave]);

  const closeFile = useCallback((filePath) => {
    debouncedSave.cancel?.();
    setOpenFiles((curr) => {
      const next = curr.filter((p) => p !== filePath);
      setActiveFile((currActive) => {
        if (currActive !== filePath) return currActive;
        const idx = curr.indexOf(filePath);
        return next[idx] || next[idx - 1] || null;
      });
      return next;
    });
  }, [debouncedSave]);

  const handleCodeChange = useCallback((newCode) => {
    if (!activeFile) return;
    setCode(newCode);
    setModifiedFiles((prev) => ({ ...prev, [activeFile]: newCode }));
    if (webContainer && isRunning) {
      webContainer.fs.writeFile(activeFile, newCode).catch(() => {});
    }
    debouncedSave(activeFile, newCode);
  }, [activeFile, debouncedSave, isRunning, setModifiedFiles, webContainer]);

  const clearListeners = useCallback(() => {
    listenerCleanupRef.current.forEach((fn) => fn());
    listenerCleanupRef.current = [];
  }, []);

  const stopRunProcess = useCallback(() => {
    clearListeners();
    if (runProcessRef.current) {
      try { runProcessRef.current.kill(); } catch {}
      runProcessRef.current = null;
    }
    setIsRunning(false);
  }, [clearListeners]);

  const runCode = useCallback(async () => {
    stopRunProcess();
    setIsRunning(true);
    setRunError("");
    const currentFiles = applyFileChanges(fileTree, modifiedFiles);
    const flatFiles = flattenFileTree(currentFiles);

    try {
      const fallbackUrl = buildFallbackPreviewUrl(flatFiles);
      setIframeUrl(fallbackUrl);
      setActiveTab("preview");
    } catch {
      setIframeUrl("about:blank");
    }

    try {
      let instance = webContainer;
      if (!instance) {
        instance = await getWebContainer();
        setWebContainer(instance);
      }
      const containerTree = toWebContainerTree(currentFiles);
      await instance.mount(containerTree);

      const serverPort = 3000;
      const portListener = (port, url) => {
        if (port === serverPort || !iframeUrl) {
          setIframeUrl(url);
          setActiveTab("preview");
        }
      };

      instance.on("server-ready", portListener);
      listenerCleanupRef.current.push(() => {
        try { instance.off("server-ready", portListener); } catch {}
      });

      const buildCmd = parseCommand(activeSuggestion?.suggestion?.buildCommand);
      const startCmd = parseCommand(activeSuggestion?.suggestion?.startCommand);
      const inferred = inferCommands(flatFiles);
      const installConfig = buildCmd || inferred.build;
      const startConfig = startCmd || inferred.start;

      if (installConfig) {
        const installProcess = await instance.spawn(installConfig.command, installConfig.args);
        const exitCode = await installProcess.exit;
        if (exitCode !== 0) setRunError("Package installation failed in WebContainer.");
      }

      if (startCmd || startConfig) {
        const config = startCmd || startConfig;
        const runProcess = await instance.spawn(config.command, config.args);
        runProcessRef.current = runProcess;
      }
    } catch (err) {
      console.warn("WebContainer environment issue, fallback live preview active:", err);
    }
  }, [activeSuggestion?.suggestion?.buildCommand, activeSuggestion?.suggestion?.startCommand, fileTree, modifiedFiles, setWebContainer, stopRunProcess, webContainer, iframeUrl]);

  useEffect(() => {
    if (!activeFile) { setCode(""); return; }
    setCode(modifiedFiles[activeFile] ?? fileContentMap[activeFile] ?? "");
  }, [activeFile, fileContentMap, modifiedFiles]);

  const activeLocalTree = useMemo(() => applyFileChanges(fileTree, modifiedFiles), [fileTree, modifiedFiles]);

  return (
    <div className="flex h-full w-full bg-[#06080e] overflow-hidden select-none relative font-sans">
      {showFiles && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setShowFiles(false)}>
          <div className="w-64 h-full bg-[#06080e] border-r border-slate-800 p-3" onClick={(e) => e.stopPropagation()}>
            <FileTree
              fileTree={activeLocalTree} tree={activeLocalTree} onSelectFile={openFile} onFileSelect={openFile}
              activeFile={activeFile} openFolders={openFolders} setOpenFolders={setOpenFolders}
              modifiedFiles={modifiedFiles} isBehindMain={isBehindMain} onSyncMain={handleSyncMain}
            />
          </div>
        </div>
      )}

      <div className="hidden lg:flex w-60 h-full bg-[#06080e] shrink-0">
        <FileTree
          fileTree={activeLocalTree} tree={activeLocalTree} onSelectFile={openFile} onFileSelect={openFile}
          activeFile={activeFile} openFolders={openFolders} setOpenFolders={setOpenFolders}
          modifiedFiles={modifiedFiles} isBehindMain={isBehindMain} onSyncMain={handleSyncMain}
        />
      </div>

      <div className="flex-1 flex flex-col h-full min-w-0 bg-[#06080e] relative">
        <TabsBar
          openFiles={openFiles} activeFile={activeFile} onSelect={openFile} onClose={closeFile}
          activeTab={activeTab} setActiveTab={setActiveTab} iframeUrl={iframeUrl} isRunning={isRunning}
          onRun={runCode} setShowFiles={setShowFiles} toggleChat={toggleChat} isChatVisible={isChatVisible}
          editorPresence={editorPresence} pendingPRs={pendingPRs} onOpenPRModal={() => setIsPRModalOpen(true)}
          isBehindMain={isBehindMain} hasLocalDraft={Object.keys(modifiedFiles).length > 0}
          onSyncMain={handleSyncMain} onDiscardDraft={handleDiscardDraft} modifiedFiles={modifiedFiles}
        />

        <div className="flex-1 relative min-h-0">
          {activeTab === "architecture" ? (
            <ArchitectureVisualizer fileTree={fileTree} />
          ) : activeTab === "preview" ? (
            <PreviewPane iframeUrl={iframeUrl} />
          ) : activeFile ? (
            <EditorPane code={code} onChange={handleCodeChange} onCursorChange={handleCursorChange} activeFile={activeFile} collaboratorPresence={collaboratorPresence} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3 font-mono text-xs select-none">
              <Folder size={36} className="text-slate-700 stroke-1" />
              <span>Select a file from the explorer sidebar to start editing</span>
            </div>
          )}
        </div>

        {activeSuggestion && (
          <CodeDiffReview isOpen={Boolean(activeSuggestion)} suggestion={activeSuggestion.suggestion} fileTree={fileTree} onApply={activeSuggestion.onApply} onCancel={activeSuggestion.onCancel} onClose={() => setActiveSuggestion(null)} isChatVisible={isChatVisible} />
        )}

        <PullRequestModal
          isOpen={isPRModalOpen} onClose={() => setIsPRModalOpen(false)}
          mode={isOwner ? "review" : "submit"} mainFileTree={fileTree}
          localFileTree={activeLocalTree} pendingPRs={pendingPRs}
          onSubmitPR={handleSubmitPR} onApprovePR={handleApprovePR} onRejectPR={handleRejectPR}
        />
      </div>

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#0c101d] border border-slate-700 shadow-2xl font-mono text-xs text-white animate-bounce">
          {toast.type === "success" ? <CheckCircle size={15} className="text-emerald-400 shrink-0" /> : toast.type === "warn" ? <AlertCircle size={15} className="text-amber-400 shrink-0" /> : <Info size={15} className="text-blue-400 shrink-0" />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-white cursor-pointer"><X size={12} /></button>
        </div>
      )}
    </div>
  );
};

export default memo(CodeEditor);
