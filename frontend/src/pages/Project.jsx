import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useUser } from "../contexts/user.context";
import { useProject } from "../contexts/project.context";
import { useMessages } from "../contexts/Messages.context";
import { useCodeEditor } from "../contexts/codeEditor.context";
import { useChat } from "../contexts/chat.context";
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
import { mergeMessages } from "../utils/mergeMessages";
import ResponsiveLayout from "../components/ProjectPage/ResponsiveLayout";
import axiosInstance from "../config/axios";
import { setSendError } from "../store/slices/chatSlice";

const Project = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const { setUser } = useUser();
  const { project, setProject, updateProjectDetails } = useProject();
  const { setMessages } = useMessages();
  const { updateTypingUser, clearTypingUsers, setIsAiThinking } = useChat();
  const { fileTree, setFileTree, webContainer, setWebContainer } =
    useCodeEditor();
  const [editorPresence, setEditorPresence] = useState([]);

  const mountedRef = useRef(false);
  const typingTimeoutsRef = useRef(new Map());
  const loadedProjectIdRef = useRef(null);
  const loadedHistoryRef = useRef(null);
  const loadedUserRef = useRef(null);

  // fetch userdata 
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/getMe");
      return data.user;
    },
    enabled: !!localStorage.getItem("token"),
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

  // fetch initial messages chunk
  const { data: messageHistory = [] } = useQuery({
    queryKey: ["messages", projectId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/project/messages/${projectId}?page=1&limit=20`,
      );
      return data.messages || [];
    },
    enabled: Boolean(projectId),
  });

  useEffect(() => {
    setMessages([]);
    loadedProjectIdRef.current = null;
    loadedHistoryRef.current = null;
  }, [projectId, setMessages]);

  useEffect(() => {
    clearTypingUsers();
    typingTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    typingTimeoutsRef.current.clear();
  }, [clearTypingUsers, projectId]);

  useEffect(() => {
    setEditorPresence([]);
  }, [projectId]);

  useEffect(() => {
    if (userData && loadedUserRef.current !== userData._id) {
      loadedUserRef.current = userData._id;
      setUser(userData);
    }
  }, [setUser, userData]);

  useEffect(() => {
    if (!projectData || loadedProjectIdRef.current === projectData._id) return;

    loadedProjectIdRef.current = projectData._id;

    const normalizedFileTree = normalizeFileTree(projectData.fileTree);
    const normalizedProject = {
      ...projectData,
      fileTree: normalizedFileTree,
    };
    setProject(normalizedProject);
    setFileTree(normalizedFileTree);
  }, [projectData, setFileTree, setProject]);

  useEffect(() => {
    if (messageHistory.length > 0 && loadedHistoryRef.current !== projectId) {
      loadedHistoryRef.current = projectId;
      setMessages((current) => mergeMessages(current, messageHistory));
    }
  }, [messageHistory, projectId, setMessages]);

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
    const typingTimeouts = typingTimeoutsRef.current;

    const cleanups = [
      receiveMessage("project-message", (message) => {
        setMessages((current) => mergeMessages(current, [message]));
        if (typeof setIsAiThinking === "function") {
          setIsAiThinking(false);
        }
      }),
      receiveMessage("project-message-edit", ({ id, message }) => {
        setMessages((current) =>
          current.map((m) =>
            String(m._id || m.id) === String(id)
              ? { ...m, message, isEdited: true }
              : m
          )
        );
      }),
      receiveMessage("project-message-delete", ({ id }) => {
        const targetId = String(id || "");
        setMessages((current) =>
          current.filter((m) => {
            const mId = String(m._id?._id || m._id || m.id || "");
            return mId !== targetId;
          })
        );
      }),
      receiveMessage("project-message-pin", ({ id, isPinned, pinnedAt }) => {
        setMessages((current) =>
          current.map((m) =>
            String(m._id || m.id) === String(id)
              ? { ...m, isPinned, pinnedAt: pinnedAt || new Date() }
              : m
          )
        );
      }),
      receiveMessage("project-message-react", ({ id, reactions }) => {
        const targetId = String(id || "");
        setMessages((current) =>
          current.map((m) => {
            const mId = String(m._id?._id || m._id || m.id || "");
            return mId === targetId ? { ...m, reactions } : m;
          })
        );
      }),
      receiveMessage("project-files-updated", (payload) => {
        const nextFileTree = normalizeFileTree(payload.fileTree);
        setFileTree(nextFileTree);
        updateProjectDetails({
          fileTree: nextFileTree,
          buildCommand: payload.buildCommand,
          startCommand: payload.startCommand,
        });
      }),
      receiveMessage("project-typing", ({ userId, username, isTyping }) => {
        const typingUserId = String(userId || "");
        if (!typingUserId) return;

        const activeTimeout = typingTimeouts.get(typingUserId);
        if (activeTimeout) clearTimeout(activeTimeout);

        updateTypingUser({ userId: typingUserId, username, isTyping });

        if (isTyping) {
          const timeout = setTimeout(() => {
            updateTypingUser({ userId: typingUserId, isTyping: false });
            typingTimeouts.delete(typingUserId);
          }, 2500);
          typingTimeouts.set(typingUserId, timeout);
        } else {
          typingTimeouts.delete(typingUserId);
        }
      }),
      receiveMessage("project-editor-presence-sync", (entries) => {
        setEditorPresence(Array.isArray(entries) ? entries : []);
      }),
      receiveMessage("project-editor-presence", (presence) => {
        if (!presence?.connectionId || !presence?.filePath) return;
        setEditorPresence((current) => [
          ...current.filter((item) => item.connectionId !== presence.connectionId),
          presence,
        ]);
      }),
      receiveMessage("project-editor-presence-leave", ({ connectionId }) => {
        setEditorPresence((current) =>
          current.filter((item) => item.connectionId !== connectionId),
        );
      }),
      receiveMessage("socket-error", ({ message }) => {
        dispatch(setSendError(message || "Chat action could not be completed."));
      }),
    ];

    return () => {
      cleanups.forEach((cleanup) => cleanup?.());
      typingTimeouts.forEach((timeout) => clearTimeout(timeout));
      typingTimeouts.clear();
      clearTypingUsers();
      setEditorPresence([]);
      disconnectSocket();
    };
  }, [
    dispatch,
    project?._id,
    setFileTree,
    setMessages,
    setIsAiThinking,
    updateProjectDetails,
    updateTypingUser,
    clearTypingUsers,
  ]);

  // Mount fileTree into webContainer safely without re-mounting thrash
  useEffect(() => {
    if (!webContainer || !fileTree || mountedRef.current) return undefined;

    let active = true;
    webContainer.mount(toWebContainerTree(fileTree))
      .then(() => {
        if (active) mountedRef.current = true;
      })
      .catch((error) => {
        if (active) console.error("WebContainer mount failed:", error);
      });

    return () => {
      active = false;
    };
  }, [fileTree, webContainer]);

  useEffect(() => {
    return () => {
      if (webContainer) teardownWebContainer(webContainer);
    };
  }, [webContainer]);

  return <ResponsiveLayout editorPresence={editorPresence} />;
};

export default Project;
