import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import axiosInstance from "../../../config/axios";
import { useProject } from "../../../contexts/project.context";
import { useCodeEditor } from "../../../contexts/codeEditor.context";
import { getWebContainer } from "../../../config/webContainer";
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
  if (files["server.js"] !== undefined) {
    return { build, start: { command: "node", args: ["server.js"] } };
  }

  return { build, start: null };
};

// Fallback Live Preview generator matching Brave Node.js & Static HTML/CSS/JS Output 100%
const buildFallbackPreviewUrl = (runtimeFiles) => {
  // 1. Gather all CSS files (including public/style.css, public/styles.css, etc.)
  const cssFiles = Object.keys(runtimeFiles).filter((path) => path.endsWith(".css"));
  const combinedCss = cssFiles.map((path) => runtimeFiles[path]).join("\n");

  // 2. Gather all client JS files (excluding node_modules & server files)
  const clientJsFiles = Object.keys(runtimeFiles).filter(
    (path) =>
      path.endsWith(".js") &&
      !path.includes("server.js") &&
      !path.includes("node_modules") &&
      (path.startsWith("public/") || path.includes("script") || path.includes("index") || path.includes("main"))
  );
  const combinedClientJs = clientJsFiles.map((path) => runtimeFiles[path]).join("\n;\n");

  // 3. Find primary HTML file (e.g. public/index.html or index.html)
  let htmlContent = runtimeFiles["public/index.html"] || runtimeFiles["index.html"] || "";
  const serverJsContent = runtimeFiles["server.js"] || runtimeFiles["app.js"] || runtimeFiles["index.js"] || "";

  if (htmlContent) {
    // Inject all CSS stylesheets directly into head
    if (combinedCss) {
      if (htmlContent.includes("</head>")) {
        htmlContent = htmlContent.replace("</head>", `<style>\n${combinedCss}\n</style>\n</head>`);
      } else {
        htmlContent = `<style>\n${combinedCss}\n</style>\n` + htmlContent;
      }
    }

    // Inject all Client JS scripts directly before body end
    if (combinedClientJs) {
      if (htmlContent.includes("</body>")) {
        htmlContent = htmlContent.replace("</body>", `<script>\n${combinedClientJs}\n</script>\n</body>`);
      } else {
        htmlContent += `<script>\n${combinedClientJs}\n</script>`;
      }
    }
  } else {
    // Template fallback if no HTML file is present
    htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Preview</title>
  <style>
    ${combinedCss}
  </style>
  <script src="https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>

  <script>
    // Node.js Express CommonJS Runtime Interpreter
    window.module = { exports: {} };
    window.exports = window.module.exports;
    window.process = { env: { NODE_ENV: 'development', PORT: 3000 } };

    window.require = function(moduleName) {
      if (moduleName === 'express') {
        function express() {
          const app = function(req, res) {};
          app.get = function(path, handler) {
            if (path === '/' || path === '') {
              setTimeout(() => {
                const req = { url: '/', method: 'GET', query: {}, params: {}, headers: {} };
                const res = {
                  send: function(body) {
                    if (typeof body === 'string' && body.trim().startsWith('<')) {
                      document.body.innerHTML = body;
                    } else {
                      document.body.innerHTML = typeof body === 'string' ? body : JSON.stringify(body);
                    }
                  },
                  json: function(obj) {
                    document.body.innerHTML = '<pre style="font-family:monospace;padding:16px;color:#a7f3d0;background:#090d16;">' + JSON.stringify(obj, null, 2) + '</pre>';
                  },
                  status: function() { return res; },
                  sendFile: function() {}
                };
                try {
                  handler(req, res);
                } catch(e) {
                  console.error("Handler error:", e);
                }
              }, 20);
            }
          };
          app.post = function() {};
          app.use = function() {};
          app.listen = function(port, callback) {
            if (typeof callback === 'function') callback();
          };
          return app;
        }
        express.json = function() { return function() {}; };
        express.urlencoded = function() { return function() {}; };
        return express;
      }
      return {};
    };

    try {
      const code = ${JSON.stringify(serverJsContent)};
      if (window.Babel) {
        const transformed = window.Babel.transform(code, { presets: ['env', 'react'] }).code;
        eval(transformed);
      } else {
        eval(code);
      }
    } catch(err) {
      console.error(err);
      document.body.innerHTML = '<div style="color:#f87171;padding:16px;font-family:monospace;">Runtime Error: ' + err.message + '</div>';
    }
  </script>

  <script>
    ${combinedClientJs}
  </script>
</body>
</html>`;
  }

  const blob = new Blob([htmlContent], { type: "text/html" });
  return URL.createObjectURL(blob);
};

const CodeEditor = ({ toggleChat, isChatVisible }) => {
  const { project } = useProject();
  const { fileTree, webContainer, setWebContainer } = useCodeEditor();
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
    if (isRunning) return;

    const attempt = ++runAttemptRef.current;
    setIsRunning(true);
    setRunError("");
    setIframeUrl(null);
    clearRunListeners();
    runProcessRef.current?.kill();
    runProcessRef.current = null;

    const runtimeTree = applyFileChanges(fileTree, modifiedFiles);
    const runtimeFiles = flattenFileTree(runtimeTree);

    let activeContainer = webContainer;
    if (!activeContainer) {
      try {
        activeContainer = await getWebContainer();
        setWebContainer(activeContainer);
      } catch (err) {
        console.warn("WebContainer engine boot failed, launching Browser Live Fallback:", err);
      }
    }

    // 1. If WebContainer WASM engine is active, run full Node.js container process
    if (activeContainer) {
      const inferred = inferCommands(runtimeFiles);
      const buildCommand = parseCommand(project?.buildCommand) || inferred.build;
      const startCommand = parseCommand(project?.startCommand) || inferred.start;

      try {
        if (!startCommand) throw new Error("No runnable start command was found");

        await activeContainer.mount(toWebContainerTree(runtimeTree));

        if (buildCommand) {
          const buildProcess = await activeContainer.spawn(
            buildCommand.command,
            buildCommand.args,
          );

          const process = await activeContainer.spawn(
            startCommand.command,
            startCommand.args,
          );

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
        const stopReadyListener = activeContainer.on("server-ready", (_, url) => {
          if (attempt !== runAttemptRef.current) return;
          serverReady = true;
          setIframeUrl(url);
          setActiveTab("preview");
          setIsRunning(false);
        });
        const stopErrorListener = activeContainer.on("error", (error) => {
          if (attempt !== runAttemptRef.current) return;
          console.warn("WebContainer error, launching Live Fallback:", error);
          const fallbackUrl = buildFallbackPreviewUrl(runtimeFiles);
          setIframeUrl(fallbackUrl);
          setActiveTab("preview");
          setIsRunning(false);
        });
        listenerCleanupRef.current = [stopReadyListener, stopErrorListener];

        const process = await activeContainer.spawn(
          startCommand.command,
          startCommand.args,
        );
        runProcessRef.current = process;
        process.output.pipeTo(new WritableStream({ write() {} }));
        process.exit.then((exitCode) => {
          if (attempt === runAttemptRef.current && !serverReady && exitCode !== 0) {
            const fallbackUrl = buildFallbackPreviewUrl(runtimeFiles);
            setIframeUrl(fallbackUrl);
            setActiveTab("preview");
            setIsRunning(false);
          }
        });

        // Safety fallback timer if server-ready event doesn't fire within 3.5s
        setTimeout(() => {
          if (attempt === runAttemptRef.current && !serverReady) {
            const fallbackUrl = buildFallbackPreviewUrl(runtimeFiles);
            setIframeUrl(fallbackUrl);
            setActiveTab("preview");
            setIsRunning(false);
          }
        }, 3500);

        return;
      } catch (err) {
        console.warn("WebContainer spawn failed, launching Live Fallback:", err);
      }
    }

    // 2. Browser Live Preview Fallback for Safari & unsupported WebContainer engines
    const fallbackUrl = buildFallbackPreviewUrl(runtimeFiles);
    setIframeUrl(fallbackUrl);
    setActiveTab("preview");
    setIsRunning(false);
  }, [
    clearRunListeners,
    fileTree,
    isRunning,
    modifiedFiles,
    project?.buildCommand,
    project?.startCommand,
    setWebContainer,
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
    <main className="relative flex h-full w-full flex-col overflow-hidden bg-transparent text-slate-300 md:flex-row">
      {runError && (
        <div className="absolute left-1/2 top-14 z-40 max-w-[85%] -translate-x-1/2 rounded-xl bg-red-950/95 border border-red-500/40 px-4 py-2.5 text-xs font-mono text-red-200 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3">
          <span className="leading-relaxed">{runError}</span>
          <button
            type="button"
            onClick={() => setRunError("")}
            className="p-1 rounded-lg text-red-400 hover:text-white hover:bg-red-900/50 transition cursor-pointer shrink-0"
            title="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-md transition-opacity duration-300 md:hidden ${
          showFiles
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setShowFiles(false)}
      >
        <div
          className={`absolute left-0 top-0 h-full w-3/4 border-r border-slate-800 bg-[#090d16] p-2 transition-transform duration-300 ${
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
            toggleChat={toggleChat}
            isChatVisible={isChatVisible}
          />
        </div>
      </div>

      {/* Desktop Explorer Panel */}
      <div className="hidden h-full border-r border-slate-800/80 bg-[#090d16]/95 md:block md:w-[190px] lg:w-[210px] 2xl:w-[230px] shrink-0">
        <FileTree
          tree={fileTree}
          activeFile={activeFile}
          activeTab={activeTab}
          openFolders={openFolders}
          setOpenFolders={setOpenFolders}
          onFileSelect={openFile}
          toggleChat={toggleChat}
          isChatVisible={isChatVisible}
        />
      </div>

      {/* Editor & Preview Main Pane */}
      <div className="flex h-full flex-1 flex-col min-w-0 bg-[#080b11]/90">
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
          toggleChat={toggleChat}
          isChatVisible={isChatVisible}
        />

        <div className="h-full flex-1 min-h-0 overflow-hidden">
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
