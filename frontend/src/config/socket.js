import { io } from 'socket.io-client'

let socketInstance = null;

// initializing Socket.io
export const initializeSocket = (projectId) => {
  if (!projectId) throw new Error("Project ID is required");

  // creating socket instance
  socketInstance = io(import.meta.env.VITE_SERVER_URL, {
    auth: { token: localStorage.getItem('token') },
    query: { projectId },
    reconnectionAttempts: 5,   
    reconnectionDelay: 1000       
  });

  socketInstance.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
  });

  socketInstance.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  return socketInstance;
};

// receive socket message form backend
export const receiveMessage =(eventName, cb)=>{
  socketInstance.on(eventName, cb)
}

// send socket message to backend
export const sendMessage =(eventName, data)=>{
    socketInstance.emit(eventName, data)
}