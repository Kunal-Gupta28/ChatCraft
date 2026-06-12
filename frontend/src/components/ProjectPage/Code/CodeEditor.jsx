import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import axiosInstance from "../../../config/axios";
import { useProject } from "../../../contexts/project.context";
import { useCodeEditor } from "../../../contexts/codeEditor.context";
import {
  applyFileChanges,
  flattenFileTree,
  toWebContainerTree,
} from "../../../utils/fileTree";
import FileTree from "./FileTree";
import TabsBar from "./TabsBar";
import EditorPane from "./EditorPane";
import PreviewPane from "./PreviewPane";
import debounce from "./utils/debounce";

const parseCommand = (command) => {
  if (!command?.mainItem || !Array.isArray(command.commands)) return null;
  return { command: command.mainItem, args: command.commands };
};

const inferCommands = (files) => {
  let packageJson;
  try {
    packageJson = JSON.parse(files["package.json"] || "null");
  } catch {
    packageJson = null;
  }

  const hasDependencies = Boolean(
    packageJson?.dependencies || packageJson?.devDependencies,
  );
  const build = hasDependencies ? { command: "npm", args: ["install"] } : null;

  if (packageJson?.scripts?.start) {
    return { build, start: { command: "npm", args: ["start"] } };
  }
  if (packageJson?.scripts?.dev) {
    return {
      build,
      start: {
        command: "npm",
        args: ["run", "dev", "--", "--host", "0.0.0.0"],
      },
    };
  }
  if (packageJson?.main) {
    return { build, start: { command: "node", args: [packageJson.main] } };
  }
  if (files["app.js"] !== undefined) {
    return { build, start: { command: "node", args: ["app.js"] } };
  }

  return { build, start: null };
};

const CodeEditor = () => {
  const { project } = useProject();
  const { fileTree, webContainer } = useCodeEditor();
  const runProcessRef = useRef(null);
  const runAttemptRef = useRef(0);
  const listenerCleanupRef = useRef([]);

  const [openFiles, setOpenFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [code, setCode] = useState("");
  const [modifiedFiles, setModifiedFiles] = useState({});
  const [openFolders, setOpenFolders] = useState({});
  const [iframeUrl, setIframeUrl] = useState(null);
  const [activeTab, setActiveTab] = useState("code");
  const [isRunning, setIsRunning] = useState(false);
  const [runError, setRunError] = useState("");
  const [showFiles, setShowFiles] = useState(false);

  const fileContentMap = useMemo(() => flattenFileTree(fileTree), [fileTree]);

  useEffect(() => {
    setModifiedFiles({});
    setOpenFiles((current) =>
      current.filter((filePath) => fileContentMap[filePath] !== undefined),
    );
    setActiveFile((current) =>
      current && fileContentMap[current] !== undefined ? current : null,
    );
  }, [fileContentMap]);

  const debouncedSave = useMemo(() => {
    if (!project?._id) return debounce(() => {}, 800);

    return debounce((path, content) => {
      axiosInstance
        .put("/project/update-file-tree", {
          projectId: project._id,
          updatedfile: path,
          newCode: content,
        })
        .catch((error) => console.error("File save failed:", error));
    }, 800);
  }, [project?._id]);

  useEffect(() => () => debouncedSave.cancel?.(), [debouncedSave]);

  const openFile = useCallback((filePath) => {
    setOpenFiles((current) =>
      current.includes(filePath) ? current : [...current, filePath],
    );
    setActiveFile(filePath);
    setShowFiles(false);
  }, []);

  useEffect(() => {
    if (!activeFile) {
      setCode("");
      return;
    }

    setCode(modifiedFiles[activeFile] ?? fileContentMap[activeFile] ?? "");
  }, [activeFile, fileContentMap, modifiedFiles]);

  const closeFile = useCallback(
    (filePath) => {
      setOpenFiles((current) => {
        const updated = current.filter((file) => file !== filePath);
        if (activeFile === filePath) setActiveFile(updated[0] || null);
        return updated;
      });
    },
    [activeFile],
  );

  const updateCode = useCallback(
    (path, newCode) => {
      const contents = newCode ?? "";
      setCode(contents);
      setModifiedFiles((current) => ({ ...current, [path]: contents }));
      debouncedSave(path, contents);

      webContainer?.fs
        .writeFile(`/${path}`, contents)
        .catch((error) => console.error("WebContainer write failed:", error));
    },
    [debouncedSave, webContainer],
  );

  const clearRunListeners = useCallback(() => {
    listenerCleanupRef.current.forEach((cleanup) => cleanup());
    listenerCleanupRef.current = [];
  }, []);

  const runProject = useCallback(async () => {
    if (!webContainer || !fileTree || isRunning) return;

    const attempt = ++runAttemptRef.current;
    setIsRunning(true);
    setRunError("");
    setIframeUrl(null);
    clearRunListeners();
    runProcessRef.current?.kill();
    runProcessRef.current = null;

    const runtimeTree = applyFileChanges(fileTree, modifiedFiles);
    const runtimeFiles = flattenFileTree(runtimeTree);
    const inferred = inferCommands(runtimeFiles);
    const buildCommand = parseCommand(project?.buildCommand) || inferred.build;
    const startCommand = parseCommand(project?.startCommand) || inferred.start;

    try {
      if (!startCommand) throw new Error("No runnable start command was found");

      await webContainer.mount(toWebContainerTree(runtimeTree));

      if (buildCommand) {
        const buildProcess = await webContainer.spawn(
          buildCommand.command,
          buildCommand.args,
        );
        // buildProcess.output.pipeTo(new WritableStream({ write() {} }));

        const process = await webContainer.spawn(
          startCommand.command,
          startCommand.args,
        );

        // process.output.pipeTo(new WritableStream({ write() {} }));

        process.output.pipeTo(
          new WritableStream({
            write(chunk) {
              console.log("[START]", chunk);
            },
          }),
        );

        runProcessRef.current = process;

        const exitCode = await buildProcess.exit;
        if (exitCode !== 0) {
          throw new Error(`Build command exited with code ${exitCode}`);
        }
      }

      let serverReady = false;
      const stopReadyListener = webContainer.on("server-ready", (_, url) => {
        if (attempt !== runAttemptRef.current) return;
        serverReady = true;
        setIframeUrl(url);
        setActiveTab("preview");
        setIsRunning(false);
      });
      const stopErrorListener = webContainer.on("error", (error) => {
        if (attempt !== runAttemptRef.current) return;
        setRunError(error.message || "WebContainer failed to run the project");
        setIsRunning(false);
      });
      listenerCleanupRef.current = [stopReadyListener, stopErrorListener];

      const process = await webContainer.spawn(
        startCommand.command,
        startCommand.args,
      );
      runProcessRef.current = process;
      process.output.pipeTo(new WritableStream({ write() {} }));
      process.exit.then((exitCode) => {
        if (
          attempt === runAttemptRef.current &&
          !serverReady &&
          exitCode !== 0
        ) {
          setRunError(`Start command exited with code ${exitCode}`);
          setIsRunning(false);
        }
      });
    } catch (error) {
      if (attempt === runAttemptRef.current) {
        setRunError(error.message || "Project failed to run");
        setIsRunning(false);
      }
    }
  }, [
    clearRunListeners,
    fileTree,
    isRunning,
    modifiedFiles,
    project?.buildCommand,
    project?.startCommand,
    webContainer,
  ]);

  useEffect(
    () => () => {
      runAttemptRef.current += 1;
      clearRunListeners();
      runProcessRef.current?.kill();
    },
    [clearRunListeners],
  );

  return (
    <main className="relative flex h-full w-full flex-col overflow-hidden bg-transparent text-gray-300 md:flex-row">
      {runError && (
        <div className="absolute left-1/2 top-16 z-40 max-w-[80%] -translate-x-1/2 rounded-md bg-red-950/95 px-4 py-2 text-sm text-red-200 shadow-lg">
          {runError}
        </div>
      )}

      <div
        className={`fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 md:hidden ${
          showFiles
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setShowFiles(false)}
      >
        <div
          className={`absolute left-0 top-0 h-full w-3/4 border-r border-gray-800 bg-gray-900 p-2 transition-transform duration-300 ${
            showFiles ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <FileTree
            tree={fileTree}
            activeFile={activeFile}
            activeTab={activeTab}
            openFolders={openFolders}
            setOpenFolders={setOpenFolders}
            onFileSelect={openFile}
          />
        </div>
      </div>

      <div className="hidden h-full border-r border-gray-800 bg-gray-900 md:block lg:w-[180px] 2xl:w-[200px]">
        <FileTree
          tree={fileTree}
          activeFile={activeFile}
          activeTab={activeTab}
          openFolders={openFolders}
          setOpenFolders={setOpenFolders}
          onFileSelect={openFile}
        />
      </div>

      <div className="flex h-full flex-1 flex-col">
        <TabsBar
          openFiles={openFiles}
          activeFile={activeFile}
          onSelect={openFile}
          onClose={closeFile}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          iframeUrl={iframeUrl}
          isRunning={isRunning}
          onRun={runProject}
          setShowFiles={setShowFiles}
        />

        <div className="h-full flex-1">
          {activeTab === "code" ? (
            <EditorPane
              activeFile={activeFile}
              code={code}
              updateCode={updateCode}
            />
          ) : (
            <PreviewPane iframeUrl={iframeUrl} />
          )}
        </div>
      </div>
    </main>
  );
};

export default memo(CodeEditor);
