require("dotenv/config");
const http = require("http");
const app = require("./app.js");
const port = process.env.PORT;
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const projectModel = require("./models/project.model.js");
const userModel = require("./models/user.model.js");
const { default: mongoose } = require("mongoose");
const { generateResult } = require("./services/ai.service.js");
const { setFileTree } = require("./services/project.service.js");
const { saveMessage } = require("./services/message.service");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL, process.env.CLIENT_URL_DEV],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// socket.io middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }
    const { projectId } = socket.handshake.query;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error("Invalid project id"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = await userModel
      .findById(decoded.userId)
      .select("_id username email");

    if (!socket.user) {
      return next(new Error("User not found"));
    }

    socket.project = await projectModel.findOne({
      _id: projectId,
      users: socket.user._id,
    });

    if (!socket.project) {
      return next(new Error("Project not found or user not authorized"));
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Socket.io connection
io.on("connection", (socket) => {
  socket.join(socket.project._id.toString());

  // Listen to project messages
  socket.on("project-message", async (data, acknowledge) => {
    try {
      const messageText = data?.message?.trim();
      if (!messageText) throw new Error("Message is required");

      // saving the message in database
      const savedUserMessage = await saveMessage({
        projectId: socket.project._id,
        senderId: socket.user._id,
        senderName: socket.user.username,
        type: "user",
        message: messageText,
      });

      io.to(socket.project._id.toString()).emit(
        "project-message",
        savedUserMessage,
      );
      acknowledge?.({ success: true, message: savedUserMessage });

      // Check if AI is tagged
      const isAiPresent = messageText.toLowerCase().includes("@ai");

      if (!isAiPresent) return;

      const prompt = messageText.replace(/@ai/gi, "").trim();

      // SAFELY call AI
      let aiData;
      try {
        aiData = await generateResult(prompt);
      } catch (err) {
        console.error("AI generation failed:", err);
        aiData = {
          text: "⚠️ AI is currently unavailable due to high load. Please try again shortly.",
        };
      }

      // if response from ai contains file tree then save it in database
      try {
        if (aiData?.fileTree) {
          const updatedProject = await setFileTree({
            projectId: socket.project._id,
            fileTree: aiData.fileTree,
            buildCommand: aiData.buildCommand,
            startCommand: aiData.startCommand,
          });
          if (!updatedProject) {
            console.error("Failed to save file tree");
          } else {
            io.to(socket.project._id.toString()).emit(
              "project-files-updated",
              {
                fileTree: updatedProject.fileTree,
                buildCommand: updatedProject.buildCommand,
                startCommand: updatedProject.startCommand,
              },
            );
          }
        }
      } catch (error) {
        console.error("failed to save Code in database");
      }

      // saving ai message in database
      const savedAiMessage = await saveMessage({
        projectId: socket.project._id,
        senderId: null,
        senderName: "AI",
        type: "ai",
        message: aiData?.text || "AI completed the request.",
      });

      // Send AI response to all users in project
      io.to(socket.project._id.toString()).emit(
        "project-message",
        savedAiMessage,
      );
    } catch (err) {
      console.error("Socket message error:", err);
      acknowledge?.({ success: false, error: err.message });
      socket.emit("project-message-error", {
        message: err.message || "Something went wrong processing your request.",
      });
    }
  });
});

server.listen(port, () => {
  console.log(`server is running at port: ${port}`);
});

module.exports = { server, io };
