import { io } from "socket.io-client";

let socketInstance = null;
let activeProjectId = null;

// initialize socket for project
export const initializeSocket = (projectId) => {
  if (!projectId) throw new Error("Project ID is required");

  // avoid duplicate sockets
  if (socketInstance && activeProjectId === projectId) {
    return socketInstance;
  }

  disconnectSocket();

  // create socket instance
  const token = localStorage.getItem("token");
  socketInstance = io(import.meta.env.VITE_SERVER_URL, {
    auth: { token },
    query: { projectId },
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });
  activeProjectId = projectId;

  // connection error
  socketInstance.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });
  return socketInstance;
};

// listen socket event
export const receiveMessage = (eventName, cb) => {
  const socket = socketInstance;
  if (!socket) return undefined;
  socket.on(eventName, cb);

  // return cleanup
  return () => socket.off(eventName, cb);
};

// send socket event
export const sendMessage = (eventName, data) => {
  return new Promise((resolve, reject) => {
    if (!socketInstance?.connected) {
      reject(new Error("Chat is not connected yet"));
      return;
    }

    socketInstance.timeout(10000).emit(eventName, data, (error, response) => {
      if (error) {
        reject(new Error("The server did not acknowledge the message"));
        return;
      }

      if (!response?.success) {
        reject(new Error(response?.error || "Message could not be sent"));
        return;
      }

      resolve(response.message);
    });
  });
};

// Send lightweight real-time events that do not need a server acknowledgment.
export const emitSocketEvent = (eventName, data) => {
  if (!socketInstance?.connected) return false;
  socketInstance.emit(eventName, data);
  return true;
};

// disconnect socket
export const disconnectSocket = () => {
  if (!socketInstance) return;
  socketInstance.disconnect();
  socketInstance = null;
  activeProjectId = null;
};
