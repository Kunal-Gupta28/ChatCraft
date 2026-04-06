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
import axiosInstance from "../config/axios";
import { useParams } from "react-router-dom";

const Project = () => {
  const { projectId } = useParams();

  // context api
  const { user: currentUser, setUser } = useUser();
  const { project: currentProject, setProject } = useProject();

  // state variable
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [fileTree, setFileTree] = useState(null);
  const [webContainer, setWebContainer] = useState(null);

  // load user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosInstance.get("/getMe");
        setUser(data.user);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);

  // load project data on refresh
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axiosInstance.get(
          `/project/get-project/${projectId}`,
        );
        setProject(res.data.project);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProject();
  }, []);

  // Load saved file tree
  useEffect(() => {
    if (currentProject?.fileTree) {
      setFileTree(currentProject.fileTree);
    }
  }, [currentProject]);

  // Load WebContainer once
  useEffect(() => {
    let isMounted = true;
    if (!webContainer) {
      getWebContainer().then((container) => {
        if (isMounted) setWebContainer(container);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [webContainer]);

  // Setup Socket for messages
  useEffect(() => {
    if (!currentProject?._id) return;

    const socket = initializeSocket(currentProject._id);

    const receiveHandler = (data) => {
      try {
        const { senderName, message } = data;

        setMessages((prev) => {
          if (senderName === "AI") {
            if (message?.fileTree) setFileTree(message.fileTree);
            return [...prev, { ...data, message: message?.text || "" }];
          }
          return [...prev, data];
        });
      } catch (err) {
        console.error("Invalid message:", data, err);
      }
    };

    const cleanup = receiveMessage("project-message", receiveHandler);

    return () => {
      cleanup?.();
      if (socket?.connected) socket.disconnect();
    };
  }, [currentProject?._id]);

  // Mount file structure
  useEffect(() => {
    if (webContainer && fileTree) {
      webContainer.mount(fileTree);
    }
  }, [webContainer, fileTree]);

  // Teardown previous instance
  useEffect(() => {
    return () => {
      webContainer?.teardown?.();
    };
  }, [webContainer]);

  // Send message
  const handleSend = useCallback(() => {
    if (!inputMessage.trim() || !currentUser?._id) return;

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
