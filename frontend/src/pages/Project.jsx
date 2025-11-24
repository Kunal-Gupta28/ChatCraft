import { useEffect, useState, useCallback } from "react";
import { useUser } from "../contexts/user.context";
import { useProject } from "../contexts/project.context";
import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../config/socket";
import CodeEditor from "../components/ProjectPage/Code/CodeEditor";
import Chat from "../components/ProjectPage/Chat/Chat";
import { getWebContainer } from "../config/webContainer";

const Project = () => {
  // context api
  const { user: currentUser } = useUser();
  const { project: currentProject } = useProject();

  // state variables
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [fileTree, setFileTree] = useState(null);
  const [webContainer, setWebContainer] = useState(null);

  // if file tree is  present in project context then save it filetree variable
  useEffect(() => {
    if (currentProject?.fileTree) {
      setFileTree(currentProject.fileTree);
    }
  }, [currentProject?.fileTree]);

  // load webcontainer once
  useEffect(() => {
    if (!webContainer) {
      getWebContainer().then((container) => setWebContainer(container));
    }
  }, [webContainer]);

  // initializing the socket setup and receive message
  useEffect(() => {
    if (!currentProject?._id) return;
    const socket = initializeSocket(currentProject._id);

    // recive message handler
    const receiveMessagaeHandler = (data) => {
      try {
        const { senderName, message } = data;

        // if AI message contains file tree then save it in filetree vairable and in chat messages
        if (senderName === "AI") {
          if (message?.fileTree) setFileTree(message.fileTree);

          setMessages((prev) => [
            ...prev,
            {
              senderName,
              senderId: data.senderId,
              message: message?.text || "",
              timestamp: data.timestamp,
            },
          ]);
          return;
        }

        // normal user message
        setMessages((prev) => [...prev, data]);
      } catch (err) {
        console.error("Invalid message:", data, err);
      }
    };

    // listener (uses correct cleanup)
    const cleanup = receiveMessage("project-message", receiveMessagaeHandler);

    // cleanup
    return () => {
      cleanup?.();
      if (socket.connected) socket.disconnect();
    };
  }, [currentProject?._id]);

  // mount fileTree in web container
  useEffect(() => {
    if (!webContainer || !fileTree) return;

    (async () => {
      await webContainer.mount(fileTree);
    })();
  }, [webContainer, fileTree]);

  // properly destroyed the previous WebContainer instance
  useEffect(() => {
    return () => {
      webContainer?.teardown?.();
    };
  }, [webContainer]);

  // send message
  const handleSend = useCallback(() => {
    if (!inputMessage.trim()) return;

    const msg = {
      senderId: currentUser._id,
      senderName: currentUser.username,
      message: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
    setInputMessage("");
    sendMessage("project-message", msg);
  }, [inputMessage, currentUser]);

  return (
    <div className="relative min-h-screen bg-gray-950 text-white flex flex-col overflow-hidden">
      {/* background gradients */}
      <div className="absolute top-0 -left-24 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-gradient-to-r from-blue-700 to-purple-700 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 -right-24 w-[400px] h-[400px] md:w-[500px] md:h-[500px] bg-gradient-to-bl from-green-500 to-cyan-500 rounded-full blur-3xl opacity-15 animate-pulse delay-1000" />

      {/* main content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-[2.5vh] md:px-4">
        <div className="flex flex-col md:flex-row w-full gap-6 h-[95vh]">
          {/* chat section*/}
          <section className="w-full md:w-[22%] h-full bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-2xl shadow-lg overflow-hidden flex flex-col">
            <Chat
              messages={messages}
              handleSend={handleSend}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
            />
          </section>

          {/* code editor section*/}
          <section className="hidden md:flex md:w-[78%] h-full bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-2xl shadow-lg overflow-hidden">
            <CodeEditor fileTree={fileTree} webContainer={webContainer} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Project;
