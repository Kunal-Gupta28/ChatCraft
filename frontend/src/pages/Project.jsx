import { useEffect, useState, useCallback } from "react";
import { useUser } from "../contexts/user.context";
import { useProject } from "../contexts/project.context";
import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../config/socket";
import { getWebContainer } from "../config/webContainer";
import ResponsiveLayout from "../components/ProjectPage/ResponsiveLayout";

const Project = () => {
  // context api
  const { user: currentUser } = useUser();
  const { project: currentProject } = useProject();

  // state variable
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [fileTree, setFileTree] = useState(null);
  const [webContainer, setWebContainer] = useState(null);

  // Load saved file tree
  useEffect(() => {
    if (currentProject?.fileTree) {
      setFileTree(currentProject.fileTree);
    }
  }, [currentProject?.fileTree]);

  // Load WebContainer once
  useEffect(() => {
    if (!webContainer) {
      getWebContainer().then((container) => setWebContainer(container));
    }
  }, [webContainer]);

  // Setup Socket for messages
  useEffect(() => {
    if (!currentProject?._id) return;
    const socket = initializeSocket(currentProject._id);

    const receiveHandler = (data) => {
      try {
        const { senderName, message } = data;
        if (senderName === "AI") {
          if (message?.fileTree) setFileTree(message.fileTree);
          setMessages((prev) => [
            ...prev,
            { ...data, message: message?.text || "" },
          ]);
        } else {
          setMessages((prev) => [...prev, data]);
        }
      } catch (err) {
        console.error("Invalid message:", data, err);
      }
    };

    const cleanup = receiveMessage("project-message", receiveHandler);
    return () => {
      cleanup?.();
      socket.connected && socket.disconnect();
    };
  }, [currentProject?._id]);

  // Mount file structure
  useEffect(() => {
    if (!webContainer || !fileTree) return;
    webContainer.mount(fileTree);
  }, [webContainer, fileTree]);

  // Teardown previous instance
  useEffect(() => {
    return () => webContainer?.teardown?.();
  }, [webContainer]);

  // Send message
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
    <ResponsiveLayout
      messages={messages}
      handleSend={handleSend}
      inputMessage={inputMessage}
      setInputMessage={setInputMessage}
      fileTree={fileTree}
      webContainer={webContainer}
    />
  );
};

export default Project;
