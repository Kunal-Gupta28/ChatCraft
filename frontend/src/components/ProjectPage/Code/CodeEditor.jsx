import { useState, useMemo, useCallback, useEffect } from "react";
import axiosInstance from "../../../config/axios";
import { useProject } from "../../../contexts/project.context";

import FileTree from "./FileTree";
import TabsBar from "./TabsBar";
import EditorPane from "./EditorPane";
import PreviewPane from "./PreviewPane";

import debounce from "./utils/debounce";

const CodeEditor = ({ fileTree, webContainer }) => {

  // context api
  const { project } = useProject();

  // state variable
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [code, setCode] = useState("");
  const [modifiedFiles, setModifiedFiles] = useState({});
  const [openFolders, setOpenFolders] = useState({});
  const [iframeUrl, setIframeUrl] = useState(null);
  const [activeTab, setActiveTab] = useState("code");
  const [isRunning, setIsRunning] = useState(false);

  // Flatten project file tree
  const fileContentMap = useMemo(() => {
    if (!fileTree) return {};

    const map = {};
    const walk = (node, base = "") => {
      for (const [name, val] of Object.entries(node)) {
        const full = base ? `${base}/${name}` : name;

        if (val.file) map[full] = val.file.contents;
        else walk(val, full);
      }
    };

    walk(fileTree);
    return map;
  }, [fileTree]);

  // send request to server for update the code of file tree in database, 0.8 sec later when the user stop typing
  const debouncedSave = useMemo(() => {
    if (!project?._id) return debounce(() => {}, 800);

    return debounce((path, content) => {
      axiosInstance
        .put("/project/update-file-tree", {
          projectId: project._id,
          updatedfile: path,
          newCode: content,
        })
        .catch((err) => console.log(err));
    }, 800);
  }, [project?._id]);

  // cancel debouncesave
  useEffect(() => {
    return () => debouncedSave.cancel?.();
  }, [debouncedSave]);

  // open file
  const openFile = useCallback(
    (filePath) => {
      if (!openFiles.includes(filePath)) {
        setOpenFiles((prev) => [...prev, filePath]);
      }

      setActiveFile(filePath);

      setCode(modifiedFiles[filePath] ?? fileContentMap[filePath] ?? "");
    },
    [openFiles, fileContentMap, modifiedFiles]
  );

  // close tab
  const closeFile = useCallback(
    (filePath) => {
      setOpenFiles((prev) => {
        const updated = prev.filter((f) => f !== filePath);

        if (activeFile === filePath) {
          if (updated.length > 0) {
            const next = updated[0];
            setActiveFile(next);
            setCode(modifiedFiles[next] ?? fileContentMap[next] ?? "");
          } else {
            setActiveFile(null);
            setCode("");
          }
        }

        return updated;
      });
    },
    [activeFile, modifiedFiles, fileContentMap]
  );

  // on update code call debouncedSave function
  const updateCode = useCallback(
    (path, newCode) => {
      const safe = newCode ?? "";

      setCode(safe);

      setModifiedFiles((prev) => ({
        ...prev,
        [path]: safe,
      }));

      // 
      debouncedSave(path, safe);
    },
    [debouncedSave]
  );

  // run webcontainer
  const runProject = async () => {
    if (!webContainer) return;

    setIsRunning(true);
    setIframeUrl(null);

    // cleanup web container
    const cleanup = () => {
      webContainer.off("server-ready", onReady);
      webContainer.off("error", onError);
    };

    // on ready function
    const onReady = (_, url) => {
      setIframeUrl(url);
      setIsRunning(false);
      cleanup();
    };

    // on error function
    const onError = (err) => {
      console.error(err);
      setIsRunning(false);
      cleanup();
    };

    webContainer.on("server-ready", onReady);
    webContainer.on("error", onError);

    try {
      const install = await webContainer.spawn("npm", ["install"]);
      await install.exit;

      const run = await webContainer.spawn("npm", ["start"]);
      run.output.pipeTo(new WritableStream({ write() {} }));
    } catch (err) {
      onError(err);
    }
  };

  return (
    <main className="h-full w-full flex bg-transparent text-gray-300 overflow-hidden">

      <div className="w-[15%] h-full">
        <FileTree
          tree={fileTree}
          activeFile={activeFile}
          activeTab={activeTab}
          openFolders={openFolders}
          setOpenFolders={setOpenFolders}
          onFileSelect={openFile}
        />
      </div>

      <div className="w-[85%] h-full flex flex-col">
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
        />

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
    </main>
  );
};

export default CodeEditor;
