import { useEffect } from "react";
import { useUser } from "../contexts/user.context";
import { useProject } from "../contexts/project.context";
import { useMessages } from "../contexts/Messages.context";
import { useCodeEditor } from "../contexts/codeEditor.context";
import {
  initializeSocket,
  receiveMessage,
} from "../config/socket";
import { getWebContainer } from "../config/webContainer";
import ResponsiveLayout from "../components/ProjectPage/ResponsiveLayout";
import axiosInstance from "../config/axios";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const Project = () => {
  const { projectId } = useParams();

  // context api
  const { setUser } = useUser();
  const { project: currentProject, setProject } = useProject();
  const { setMessages } = useMessages();
  const { fileTree,setFileTree, webContainer, setWebContainer } = useCodeEditor();

  // load user data
  const fetchUser = async () => {
    const { data } = await axiosInstance.get("/getMe");
    return data.user;
  };

  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData, setUser]);

  // load project data on refresh
  const fetchProject = async () => {
    const { data } = await axiosInstance.get(
      `/project/get-project/${projectId}`
    );
    return data.project;
  };

  const { data: projectData } = useQuery({
    queryKey: ["project", projectId],
    queryFn: fetchProject,
    enabled: !!projectId,
  });

  useEffect(() => {
    if (projectData) {
      setProject(projectData);
    }
  }, [projectData, setProject]);

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
      socket?.disconnect(); 
    };
  }, [currentProject?._id, setMessages]);

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

  return (
    <ResponsiveLayout/>
  );
};

export default Project;