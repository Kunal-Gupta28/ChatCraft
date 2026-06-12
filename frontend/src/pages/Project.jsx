import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../contexts/user.context";
import { useProject } from "../contexts/project.context";
import { useMessages } from "../contexts/Messages.context";
import { useCodeEditor } from "../contexts/codeEditor.context";
import {
  disconnectSocket,
  initializeSocket,
  receiveMessage,
} from "../config/socket";
import {
  getWebContainer,
  teardownWebContainer,
} from "../config/webContainer";
import { normalizeFileTree, toWebContainerTree } from "../utils/fileTree";
import ResponsiveLayout from "../components/ProjectPage/ResponsiveLayout";
import axiosInstance from "../config/axios";

const mergeMessages = (current, incoming) => {
  const merged = new Map();

  for (const message of [...current, ...incoming]) {
    const key = message._id
      ? String(message._id)
      : `${message.senderName}-${message.createdAt}-${message.message}`;
    merged.set(key, message);
  }

  return [...merged.values()].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  );
};

const Project = () => {
  const { projectId } = useParams();
  const { setUser } = useUser();
  const { project, setProject } = useProject();
  const { setMessages } = useMessages();
  const { fileTree, setFileTree, webContainer, setWebContainer } =
    useCodeEditor();

    // fetch userdata 
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/getMe");
      return data.user;
    },
  });

  // fetch project data 
  const { data: projectData } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/project/get-project/${projectId}`,
      );
      return data.project;
    },
    enabled: Boolean(projectId),
  });

  // fetch messages
  const { data: messageHistory = [] } = useQuery({
    queryKey: ["messages", projectId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/project/messages/${projectId}`,
      );
      return data.messages;
    },
    enabled: Boolean(projectId),
  });

  useEffect(() => {
    setMessages([]);
  }, [projectId, setMessages]);

  useEffect(() => {
    if (userData) setUser(userData);
  }, [setUser, userData]);

  useEffect(() => {
    if (!projectData) return;

    const normalizedProject = {
      ...projectData,
      fileTree: normalizeFileTree(projectData.fileTree),
    };
    setProject(normalizedProject);
    setFileTree(normalizedProject.fileTree);
  }, [projectData, setFileTree, setProject]);

  useEffect(() => {
    if (messageHistory.length > 0) {
      setMessages((current) => mergeMessages(current, messageHistory));
    }
  }, [messageHistory, setMessages]);

  useEffect(() => {
    let active = true;

    if (!webContainer) {
      getWebContainer()
        .then((container) => {
          if (active) setWebContainer(container);
        })
        .catch((error) => console.error("WebContainer boot failed:", error));
    }

    return () => {
      active = false;
    };
  }, [setWebContainer, webContainer]);

  useEffect(() => {
    if (!project?._id) return undefined;

    initializeSocket(project._id);

    const cleanups = [
      receiveMessage("project-message", (message) => {
        setMessages((current) => mergeMessages(current, [message]));
      }),
      receiveMessage("project-files-updated", (payload) => {
        const nextFileTree = normalizeFileTree(payload.fileTree);
        setFileTree(nextFileTree);
        setProject((current) => ({
          ...current,
          fileTree: nextFileTree,
          buildCommand: payload.buildCommand,
          startCommand: payload.startCommand,
        }));
      }),
      receiveMessage("project-message-error", (error) => {
        console.error("Message error:", error.message);
      }),
    ];

    return () => {
      cleanups.forEach((cleanup) => cleanup?.());
      disconnectSocket();
    };
  }, [project?._id, setFileTree, setMessages, setProject]);

  useEffect(() => {
    if (!webContainer || !fileTree) return undefined;

    let active = true;
    webContainer.mount(toWebContainerTree(fileTree)).catch((error) => {
      if (active) console.error("WebContainer mount failed:", error);
    });

    return () => {
      active = false;
    };
  }, [fileTree, webContainer]);

  useEffect(() => {
    if (webContainer) getWebContainer();

    return () => {
      if (webContainer) teardownWebContainer(webContainer);
    };
  }, [webContainer]);

  return <ResponsiveLayout />;
};

export default Project;
