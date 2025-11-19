import { useEffect, useState } from "react";
import { useUser } from "../contexts/user.context";
import { useProject } from "../contexts/project.context";
import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../config/socket";
import CodeEditor from "../components/CodeEditor";
import ChatSection from "../components/ChatSection";
import { getWebContainer } from "../config/webContainer";

const Project = () => {
  
  const { user: currentUser } = useUser();
  const { project : currentProject } = useProject();

  // state variables
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [fileTree, setFileTree] = useState();
  const [webContainer, setWebContainer] = useState(null);

  useEffect(()=>{
    if(currentProject.fileTree){
      setFileTree(currentProject.fileTree)
    }
  },[])
  // Socket.io setup
  useEffect(() => {
    // initializing socket id
    if (!currentProject?._id) return;
    const socket = initializeSocket(currentProject._id);

    // initializing web container
    if (!webContainer) {
      getWebContainer().then((container) => {
        setWebContainer(container);
      });
    }

    // receive message
    receiveMessage("project-message", (messageData) => {
      console.log(messageData)
      try {
        const { senderId, senderName, message, timestamp } = messageData;

        if (senderName === "AI") {
          const chatMessage = {
            senderId,
            senderName,
            message: message.text || "",
            timestamp,
          };

          if (message?.fileTree) {
            setFileTree(message.fileTree);
          }

          setMessages((prev) => [...prev, chatMessage]);
        } else {
          setMessages((prev) => [...prev, messageData]);
        }
      } catch (err) {
        console.error("Invalid message data:", messageData, err);
      }
    });

    return () => socket.disconnect();
  }, [currentProject?._id, webContainer]);

  //  mouting the filetree in webcontainer when webcontainer is successfully booted and filetree is present
  useEffect(() => {
    if (webContainer && fileTree) {
      webContainer.mount(fileTree);
    }
  }, [webContainer, fileTree]);

  // Send message
  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg = {
      senderId: currentUser._id,
      senderName: currentUser.username,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
    sendMessage("project-message", msg);
  };

  return (
    <div className="relative min-h-screen bg-gray-950 text-white flex flex-col overflow-hidden">
      {/* --- Background gradients --- */}
      <div className="absolute top-0 -left-24 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-gradient-to-r from-blue-700 to-purple-700 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 -right-24 w-[400px] h-[400px] md:w-[500px] md:h-[500px] bg-gradient-to-bl from-green-500 to-cyan-500 rounded-full blur-3xl opacity-15 animate-pulse delay-1000" />

      {/* --- Main content --- */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-[2.5vh] md:px-4">
        <div className="flex flex-col md:flex-row w-full gap-6 h-[95vh]">
          {/* Chat Section */}
          <div className="w-full md:w-[22%] h-full bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-2xl shadow-lg overflow-hidden flex flex-col">
            <ChatSection
              messages={messages}
              handleSend={handleSend}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
            />
          </div>
          {/* Code Editor */}
          <div className="hidden md:flex md:w-[78%] h-full bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-2xl shadow-lg overflow-hidden">
            <CodeEditor fileTree={fileTree} webContainer={webContainer} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Project;
