require("dotenv/config");
const http = require("http");
const app = require("./app.js");
const port = process.env.PORT;
const { Server } = require("socket.io");
const { setupProjectSockets } = require("./sockets/projectSockets.js");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL, process.env.CLIENT_URL_DEV],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// Initialize Socket.io authentication & event handlers
setupProjectSockets(io);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
