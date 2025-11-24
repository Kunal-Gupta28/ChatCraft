import { io } from "socket.io-client";

let socketInstance = null;

// initialize socket for project
export const initializeSocket = (projectId) => {
  if (!projectId) throw new Error("Project ID is required");

  // avoid duplicate sockets
  if (socketInstance && socketInstance.connected) {
    return socketInstance;
  }

  // create socket instance
  socketInstance = io(import.meta.env.VITE_SERVER_URL, {
    auth: {
      token: localStorage.getItem("token"),
    },
    query: { projectId },
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  // connection error
  socketInstance.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  // disconnected
  socketInstance.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
    socketInstance = null;
  });

  return socketInstance;
};

// listen socket event
export const receiveMessage = (eventName, cb) => {
  if (!socketInstance) return;
  socketInstance.on(eventName, cb);

  // return cleanup
  return () => socketInstance.off(eventName, cb);
};

// send socket event
export const sendMessage = (eventName, data) => {
  if (!socketInstance) return;
  socketInstance.emit(eventName, data);
};

// disconnect socket
export const disconnectSocket = () => {
  if (!socketInstance) return;
  socketInstance.disconnect();
  socketInstance = null;
};