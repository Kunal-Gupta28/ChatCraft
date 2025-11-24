require("dotenv/config");
const http = require("http");
const app = require("./app.js");
const port = process.env.PORT;
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const projectModel = require("./models/project.model.js");
const { default: mongoose } = require("mongoose");
const { generateResult } = require("./services/ai.service.js");
const { setFileTree } = require("./services/project.service.js");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin:[ process.env.CLIENT_URL,process.env.CLIENT_URL_DEV],
    methods: ["GET", "POST"],
  },
});

// socket.io middleware
io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new Error("Authentication error"));
    }
    const { projectId } = socket.handshake.query;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error("Invalid project id"));
    }
    socket.project = await projectModel.findById(projectId);

    if (!socket.project) {
      return next(new Error("Project not found"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return next(new Error("Authentication error"));
    }

    socket.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
});

// Socket.io connection
io.on("connection", (socket) => {
  socket.join(socket.project._id.toString());

  // Listen to project messages
  socket.on("project-message", async (data) => {

    try {
      // Broadcast user's message to others
      socket.broadcast
        .to(socket.project._id.toString())
        .emit("project-message", data);

      // Check if AI is tagged
      const isAiPresent = data.message?.includes("@ai");

      if (!isAiPresent) return;

      const prompt = data.message.replace("@ai", "").trim();

      // 🔥 SAFELY call AI
      let aiData;
      try {
        aiData = await generateResult(prompt);
      } catch (err) {
        console.error("AI generation failed:", err);
        aiData = {
          text: "⚠️ AI is currently unavailable due to high load. Please try again shortly.",
        };
      }

      try {
        if(aiData?.fileTree){
          const updatedProject = await setFileTree({
          projectId: socket.project._id,
          fileTree: aiData?.fileTree,
        });
               if (!updatedProject) {
          console.error("Failed to save file tree");
        }
        }
 
      } catch (error) {
        console.error("failed to save Code in database");
      }

      const aiResponse = {
        senderName: "AI",
        message: aiData,
        timestamp: new Date().toISOString(),
      };

      // Send AI response to all users in project
      io.to(socket.project._id.toString()).emit("project-message", aiResponse);
    } catch (err) {
      console.error("Socket message error:", err);

      // Prevent crash by sending an error message instead
      io.to(socket.id).emit("project-message", {
        senderName: "AI",
        message: {
          text: "❌ Something went wrong processing your request.",
        },
        timestamp: new Date().toISOString(),
      });
    }
  });
});

server.listen(port, () => {
  console.log(`server is running at port: ${port}`);
});

// Export io for use in other modules
module.exports = { server, io };
