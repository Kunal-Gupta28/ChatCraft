import { useState } from "react";
import { Folder, FolderOpen, FileCode2, Play, Loader2 } from "lucide-react";
import FileTab from "./FileTab";
import MarkdownWithCode from "./MarkdownWithCode";
import axiosInstance from "../config/axios";
import { useProject } from "../contexts/project.context";

const CodeEditor = ({ fileTree, webContainer }) => {
  const { project } = useProject();
  // state variables
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [code, setCode] = useState("");
  const [openFolders, setOpenFolders] = useState({});
  const [iframeUrl, setIframeUrl] = useState(null);
  const [activeTab, setActiveTab] = useState("code");
  const [isRunning, setIsRunning] = useState(false);

  // Helper function to find file content (unchanged)
  const findFileContent = (tree, filePath) => {
    const parts = filePath.split("/").filter(Boolean);
    let current = tree;
    for (const part of parts) {
      if (current[part]) {
        if (current[part].file) {
          return current[part].file.contents;
        }
        current = current[part];
      } else {
        return null;
      }
    }
    return null;
  };

  const handleFileClick = (parentPath, name, fileContent) => {
    const filePath = parentPath + name;
    if (!openFiles.includes(filePath))
      setOpenFiles((prev) => [...prev, filePath]);
    setActiveFile(filePath);
    setCode(fileContent);
  };

  // Handler to switch active file (unchanged)
  const handleTabClick = (fileName) => {
    setActiveFile(fileName);
    const fileContent = findFileContent(fileTree, fileName);
    if (fileContent) {
      setCode(fileContent);
    } else {
      setCode("");
    }
  };

  // Handler to close tab (unchanged)
  const handleTabClose = (fileNameToClose) => {
    setOpenFiles((prev) => prev.filter((f) => f !== fileNameToClose));
    if (activeFile === fileNameToClose) {
      const remainingFiles = openFiles.filter((f) => f !== fileNameToClose);
      if (remainingFiles.length > 0) {
        const newActiveFile = remainingFiles[0];
        setActiveFile(newActiveFile);
        const fileContent = findFileContent(fileTree, newActiveFile);
        if (fileContent) {
          const markdownCode = "```javascript\n" + fileContent + "\n```";
          setCode(markdownCode);
        } else {
          setCode("");
        }
      } else {
        setActiveFile(null);
        setCode("");
      }
    }
  };

  const toggleFolder = (folderPath) => {
    setOpenFolders((prev) => ({ ...prev, [folderPath]: !prev[folderPath] }));
  };

  // --- MODIFIED: Render function with dark mode styles ---
  const renderFiles = (tree, parentPath = "") =>
    Object.entries(tree).map(([name, value]) => {
      const fullPath = parentPath + name;

      if (value.file) {
        return (
          <div
            key={fullPath}
            onClick={
              activeTab !== "preview"
                ? () => handleFileClick(parentPath, name, value.file.contents)
                : undefined
            }
            className={`flex items-center gap-2 p-1 px-2 rounded truncate transition-colors 
  ${activeFile === fullPath ? "bg-gray-700 text-gray-100 font-medium" : ""}
  ${
    activeTab === "preview"
      ? "opacity-40 cursor-not-allowed"
      : "cursor-pointer hover:bg-gray-700/50"
  }
`}
          >
            <FileCode2 size={16} className="text-blue-400 flex-shrink-0" />
            <span className="truncate">{name}</span>
          </div>
        );
      } else {
        const isOpen = openFolders[fullPath];
        return (
          <div key={fullPath} className="ml-2">
            <div
              onClick={
                activeTab !== "preview"
                  ? () => toggleFolder(fullPath)
                  : undefined
              }
              className={`flex items-center gap-1 font-medium text-gray-300 transition-colors
  ${
    activeTab === "preview"
      ? "opacity-40 cursor-not-allowed"
      : "cursor-pointer hover:text-blue-400"
  }
`}
            >
              {isOpen ? (
                <FolderOpen size={16} className="text-yellow-400" /> // <-- Icon color
              ) : (
                <Folder size={16} className="text-yellow-400" /> // <-- Icon color
              )}
              <span>{name}/</span>
            </div>
            {isOpen && (
              <div className="ml-4 border-l border-gray-700 pl-2">
                {" "}
                {/* <-- Added guide line */}
                {renderFiles(value, fullPath + "/")}
              </div>
            )}
          </div>
        );
      }
    });

  // handle change code
  const handleCodeChange = async (activeFile, newCode) => {
    try {
      const response = await axiosInstance.put("/project/update-file-tree", {
        projectId: project._id,
        updatedfile: activeFile,
        newCode,
      });

      setCode(newCode);
    } catch (error) {
      console.log(error);
    }
  };

  // --- MODIFIED: handleRunCode to use webContainer prop ---
  const handleRunCode = async () => {
    if (!webContainer) {
      console.error("WebContainer is not ready.");
      return;
    }

    setIsRunning(true);
    setIframeUrl(null);

    const installProcess = await webContainer.spawn("npm", ["install"]);
    installProcess.output.pipeTo(
      new WritableStream({
        write(chunks) {
          console.log("INSTALL:", chunks);
        },
      })
    );

    const installExitCode = await installProcess.exit;
    if (installExitCode !== 0) {
      console.error("Install failed");
      setIsRunning(false);
      return;
    }

    console.log("Install complete, starting server...");
    const runProcess = await webContainer.spawn("npm", ["start"]);

    runProcess.output.pipeTo(
      new WritableStream({
        write(chunks) {
          console.log("RUN:", chunks);
        },
      })
    );

    webContainer.on("server-ready", (port, url) => {
      console.log(`Server ready at: ${url}`);
      setIframeUrl(url);
      setIsRunning(false);
    });

    webContainer.on("error", (err) => {
      console.error("WebContainer error:", err);
      setIsRunning(false);
    });
  };

  return (
    // --- MODIFIED: Main container with dark styles ---
    <main className="w-full h-full flex bg-transparent text-gray-300 overflow-hidden">
      {/* File Tree */}
      <aside className="w-[15%] h-full border-r border-gray-700 p-3 bg-gray-900/30 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
        <h2 className="font-semibold mb-3 text-gray-200">File Structure</h2>
        {fileTree ? (
          renderFiles(fileTree)
        ) : (
          <p className="text-gray-500">No files yet</p>
        )}
      </aside>

      {/* Editor */}
      <section className="w-[85%] h-full flex flex-col">
        {/* Tabs and Run Button Container */}
        <div className="flex justify-between items-center bg-gray-900/50 border-b border-gray-700 flex-shrink-0">
          {/* Tabs */}
          <div className="flex gap-px p-2 overflow-x-auto flex-grow">
            {openFiles.map((fileName) => (
              <FileTab
                key={fileName}
                fileName={fileName}
                isActive={activeFile === fileName}
                disabled={activeTab === "preview"} // <-- DISABLE HERE
                onClick={() => handleTabClick(fileName)}
                onClose={() => handleTabClose(fileName)}
              />
            ))}
          </div>

          {/* code and preview button */}
          <div className="flex items-center bg-gray-800/60 border border-gray-700 rounded-full overflow-hidden mx-3">
            <button
              className={`px-4 py-1.5 text-sm font-medium transition-all ${
                activeTab === "code"
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              onClick={() => setActiveTab("code")}
            >
              Code
            </button>

            <button
              disabled={!iframeUrl || isRunning}
              className={`px-4 py-1.5 text-sm font-medium transition-all ${
                activeTab === "preview"
                  ? "bg-gray-700 text-white"
                  : !iframeUrl
                  ? "text-gray-600 cursor-not-allowed"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              onClick={() => iframeUrl && setActiveTab("preview")}
            >
              Preview
            </button>
          </div>

          {/* Run Button */}
          <div className="p-2 flex-shrink-0">
            <button
              onClick={handleRunCode}
              disabled={!fileTree || isRunning} // <-- Disable if no files or already running
              className={`flex items-center justify-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-md transition-all w-[80px] ${
                fileTree && !isRunning
                  ? "bg-green-600 text-white hover:bg-green-700 shadow-md"
                  : "bg-gray-600 text-gray-400 opacity-70 cursor-not-allowed"
              }`}
              aria-label="Run Code"
              title="Run Code"
            >
              {isRunning ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Play size={16} fill="white" />
                  Run
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Display or project preview */}
        {activeTab === "code" ? (
          <div className="flex-1 overflow-y-auto">
            {activeFile ? (
              <MarkdownWithCode
                code={code}
                fileName={activeFile}
                onChange={(newCode) => handleCodeChange(activeFile, newCode)}
              />
            ) : (
              <p className="pt-6 text-center text-gray-400 italic">
                Select a file to view
              </p>
            )}
          </div>
        ) : !iframeUrl ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Waiting for server...
          </div>
        ) : (
          <iframe src={iframeUrl} className="w-full h-full border-0" />
        )}
      </section>
    </main>
  );
};

export default CodeEditor;
