require("dotenv/config");
const http = require("http");
const app = require("./app.js");
const port = process.env.PORT;
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const projectModel = require("./models/project.model.js");
const userModel = require("./models/user.model.js");
const { default: mongoose } = require("mongoose");
const { generateResult, generateAudioResult } = require("./services/ai.service.js");
const { setFileTree } = require("./services/project.service.js");
const {
  saveMessage,
  deleteMessageById,
  editMessageById,
  togglePinMessageById,
  toggleReactionOnMessage,
} = require("./services/message.service");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL, process.env.CLIENT_URL_DEV],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

const editorPresenceByProject = new Map();
const PRESENCE_COLOR_COUNT = 5;

const getPresenceColorIndex = (userId) => {
  return String(userId)
    .split("")
    .reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0, 0) % PRESENCE_COLOR_COUNT;
};

const getProjectPresence = (projectId) => {
  if (!editorPresenceByProject.has(projectId)) {
    editorPresenceByProject.set(projectId, new Map());
  }
  return editorPresenceByProject.get(projectId);
};

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
      $or: [
        { users: socket.user._id },
        { users: String(socket.user._id) },
        { owner: String(socket.user._id) },
      ],
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
  const projectRoomId = socket.project._id.toString();
  socket.join(projectRoomId);
  socket.emit(
    "project-editor-presence-sync",
    Array.from(getProjectPresence(projectRoomId).values()),
  );

  const reportSocketError = (event, acknowledge, error) => {
    const message = error?.message || "Something went wrong processing your request.";
    console.error(`Socket ${event} error:`, error);
    acknowledge?.({ success: false, error: message });
    socket.emit("socket-error", { event, message });
  };

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
        replyTo: data?.replyTo,
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
        const latestProject = await projectModel
          .findById(socket.project._id)
          .select("fileTree");
        aiData = await generateResult(
          prompt,
          latestProject?.fileTree || socket.project.fileTree,
        );
      } catch (err) {
        console.error("AI generation failed:", err);
        aiData = {
          text: "⚠️ AI is currently unavailable due to high load. Please try again shortly.",
        };
      }

      // saving ai message in database
      const savedAiMessage = await saveMessage({
        projectId: socket.project._id,
        senderId: null,
        senderName: "AI",
        type: "ai",
        message: aiData?.text || "AI completed the request.",
        codeSuggestion: aiData?.fileTree
          ? {
              fileTree: aiData.fileTree,
              buildCommand: aiData.buildCommand,
              startCommand: aiData.startCommand,
            }
          : undefined,
      });

      // Send AI response to all users in project
      io.to(socket.project._id.toString()).emit(
        "project-message",
        savedAiMessage,
      );
    } catch (err) {
      reportSocketError("project-message", acknowledge, err);
    }
  });

  socket.on("project-audio-message", async (data, acknowledge) => {
    try {
      const audioUrl = String(data?.audioUrl || "");
      const audioMatch = audioUrl.match(
        /^data:(audio\/(?:webm|ogg|mp4|mpeg));base64,([A-Za-z0-9+/=]+)$/i,
      );

      if (!audioMatch) {
        throw new Error("Please send a valid audio recording");
      }

      const audioSize = Buffer.from(audioMatch[2], "base64").length;
      if (audioSize === 0 || audioSize > 650 * 1024) {
        throw new Error("Voice notes must be smaller than 650 KB");
      }

      const duration = Math.min(
        10,
        Math.max(1, Math.round(Number(data?.duration) || 0)),
      );
      const savedAudioMessage = await saveMessage({
        projectId: socket.project._id,
        senderId: socket.user._id,
        senderName: socket.user.username,
        type: "audio",
        message: "Voice message",
        audioUrl,
        audioDuration: duration,
        replyTo: data?.replyTo,
      });

      io.to(socket.project._id.toString()).emit(
        "project-message",
        savedAudioMessage,
      );
      acknowledge?.({ success: true, message: savedAudioMessage });

      if (!data?.sendToAI) return;

      const latestProject = await projectModel
        .findById(socket.project._id)
        .select("fileTree");
      const aiData = await generateAudioResult({
        audioBase64: audioMatch[2],
        mimeType: audioMatch[1],
        currentFileTree: latestProject?.fileTree || socket.project.fileTree,
      });
      const savedAiMessage = await saveMessage({
        projectId: socket.project._id,
        senderId: null,
        senderName: "AI",
        type: "ai",
        message: aiData?.text || "AI completed the voice request.",
        codeSuggestion: aiData?.fileTree
          ? {
              fileTree: aiData.fileTree,
              buildCommand: aiData.buildCommand,
              startCommand: aiData.startCommand,
            }
          : undefined,
      });

      io.to(socket.project._id.toString()).emit(
        "project-message",
        savedAiMessage,
      );
    } catch (err) {
      reportSocketError("project-audio-message", acknowledge, err);
    }
  });

  // Apply an AI suggestion only after the user has reviewed its diff.
  socket.on("project-files-apply", async (data, acknowledge) => {
    try {
      if (!data?.fileTree || typeof data.fileTree !== "object") {
        throw new Error("A valid code suggestion is required");
      }

      const updatedProject = await setFileTree({
        projectId: socket.project._id,
        fileTree: data.fileTree,
        buildCommand: data.buildCommand,
        startCommand: data.startCommand,
        userId: socket.user._id,
      });

      if (!updatedProject) {
        throw new Error("Project not found or user not authorized");
      }

      const payload = {
        fileTree: updatedProject.fileTree,
        buildCommand: updatedProject.buildCommand,
        startCommand: updatedProject.startCommand,
      };

      socket.project = updatedProject;
      io.to(socket.project._id.toString()).emit("project-files-updated", payload);
      acknowledge?.({ success: true, message: payload });
    } catch (err) {
      reportSocketError("project-files-apply", acknowledge, err);
    }
  });

  // Broadcast ephemeral typing state to collaborators without storing it.
  socket.on("project-typing", (data) => {
    socket.to(socket.project._id.toString()).emit("project-typing", {
      userId: String(socket.user._id),
      username: socket.user.username,
      isTyping: Boolean(data?.isTyping),
    });
  });

  socket.on("project-editor-presence", (data) => {
    const presence = getProjectPresence(projectRoomId);
    const filePath = typeof data?.filePath === "string" ? data.filePath.trim() : "";

    if (!filePath) {
      if (presence.delete(socket.id)) {
        socket.to(projectRoomId).emit("project-editor-presence-leave", {
          connectionId: socket.id,
        });
      }
      return;
    }

    if (filePath.length > 300) return;

    const lineNumber = Number(data?.cursor?.lineNumber);
    const column = Number(data?.cursor?.column);
    const cursor = {
      lineNumber: Number.isInteger(lineNumber) && lineNumber > 0 ? Math.min(lineNumber, 100000) : 1,
      column: Number.isInteger(column) && column > 0 ? Math.min(column, 100000) : 1,
    };
    const payload = {
      connectionId: socket.id,
      userId: String(socket.user._id),
      username: socket.user.username,
      filePath,
      cursor,
      colorIndex: getPresenceColorIndex(socket.user._id),
    };

    presence.set(socket.id, payload);
    socket.to(projectRoomId).emit("project-editor-presence", payload);
  });

  // Listen for message edit
  socket.on("project-message-edit", async (data, acknowledge) => {
    try {
      const { id, message } = data || {};
      const trimmedMessage = String(message ?? "").trim();
      if (!id || !trimmedMessage) throw new Error("Message ID and content required");

      const updated = await editMessageById({
        messageId: id,
        message: trimmedMessage,
        userId: socket.user._id,
        projectId: socket.project._id,
      });

      io.to(socket.project._id.toString()).emit("project-message-edit", {
        id,
        message: updated.message,
      });
      acknowledge?.({ success: true, message: updated });
    } catch (err) {
      reportSocketError("project-message-edit", acknowledge, err);
    }
  });

  // Listen for message delete
  socket.on("project-message-delete", async (data, acknowledge) => {
    try {
      const { id } = data || {};
      if (!id) throw new Error("Message ID required");

      await deleteMessageById({
        messageId: id,
        userId: socket.user._id,
        projectId: socket.project._id,
      });

      io.to(socket.project._id.toString()).emit("project-message-delete", { id });
      acknowledge?.({ success: true });
    } catch (err) {
      reportSocketError("project-message-delete", acknowledge, err);
    }
  });

  // Listen for message pin toggle
  socket.on("project-message-pin", async (data, acknowledge) => {
    try {
      const { id } = data || {};
      if (!id) throw new Error("Message ID required");

      const updated = await togglePinMessageById({
        messageId: id,
        projectId: socket.project._id,
      });

      io.to(socket.project._id.toString()).emit("project-message-pin", {
        id,
        isPinned: updated.isPinned,
        pinnedAt: updated.pinnedAt,
      });
      acknowledge?.({ success: true, isPinned: updated.isPinned });
    } catch (err) {
      reportSocketError("project-message-pin", acknowledge, err);
    }
  });

  // Listen for message reaction toggle
  socket.on("project-message-react", async (data, acknowledge) => {
    try {
      const { id, emoji } = data || {};
      if (!id || !emoji) throw new Error("Message ID and emoji required");

      const updated = await toggleReactionOnMessage({
        messageId: id,
        emoji,
        userId: socket.user._id,
        username: socket.user.username,
      });

      io.to(socket.project._id.toString()).emit("project-message-react", {
        id,
        reactions: updated.reactions,
      });
      acknowledge?.({ success: true, reactions: updated.reactions });
    } catch (err) {
      reportSocketError("project-message-react", acknowledge, err);
    }
  });

  socket.on("disconnect", () => {
    const presence = editorPresenceByProject.get(projectRoomId);
    if (!presence?.delete(socket.id)) return;

    if (presence.size === 0) {
      editorPresenceByProject.delete(projectRoomId);
    }
    socket.to(projectRoomId).emit("project-editor-presence-leave", {
      connectionId: socket.id,
    });
  });
});

server.listen(port, () => {
  console.log(`server is running at port: ${port}`);
});

module.exports = { server, io };
