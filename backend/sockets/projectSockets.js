const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const projectModel = require("../models/project.model.js");
const userModel = require("../models/user.model.js");
const { generateResult, generateAudioResult } = require("../services/ai.service.js");
const { setFileTree } = require("../services/project.service.js");
const {
  saveMessage,
  deleteMessageById,
  editMessageById,
  togglePinMessageById,
  toggleReactionOnMessage,
} = require("../services/message.service");

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

const setupProjectSockets = (io) => {
  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication error"));

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

  // Socket connection
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

    socket.on("project-message", async (data, acknowledge) => {
      try {
        const messageText = data?.message?.trim();
        if (!messageText) throw new Error("Message is required");

        const savedUserMessage = await saveMessage({
          projectId: socket.project._id,
          senderId: socket.user._id,
          senderName: socket.user.username,
          type: "user",
          message: messageText,
          replyTo: data?.replyTo,
        });

        io.to(projectRoomId).emit("project-message", savedUserMessage);
        acknowledge?.({ success: true, message: savedUserMessage });

        if (messageText.toLowerCase().includes("@ai")) {
          io.to(projectRoomId).emit("project-ai-thinking", {
            userId: socket.user._id,
            username: socket.user.username,
            isThinking: true,
          });

          try {
            const aiResult = await generateResult(messageText, socket.project.fileTree);

            let responseText = "AI generated response.";
            let codeSuggestionPayload = null;

            if (typeof aiResult === "object" && aiResult !== null) {
              responseText = aiResult.text || aiResult.explanation || "AI generated the requested file changes.";
              if (aiResult.fileTree) {
                codeSuggestionPayload = aiResult;
              }
            } else if (typeof aiResult === "string") {
              responseText = aiResult;
            }

            const savedAiMessage = await saveMessage({
              projectId: socket.project._id,
              senderId: null,
              senderName: "Gemini 2.5 AI",
              type: "ai",
              message: responseText,
              codeSuggestion: codeSuggestionPayload,
            });

            io.to(projectRoomId).emit("project-message", savedAiMessage);

            if (codeSuggestionPayload?.fileTree) {
              const updatedProject = await setFileTree({
                projectId: socket.project._id,
                fileTree: codeSuggestionPayload.fileTree,
                buildCommand: codeSuggestionPayload.buildCommand,
                startCommand: codeSuggestionPayload.startCommand,
              });

              socket.project.fileTree = updatedProject.fileTree;

              io.to(projectRoomId).emit("project-files-updated", {
                fileTree: updatedProject.fileTree,
                buildCommand: updatedProject.buildCommand,
                startCommand: updatedProject.startCommand,
              });
            }
          } catch (aiErr) {
            console.error("AI Generation Exception Caught:", aiErr.message);
            const errStr = String(aiErr?.message || "").toLowerCase();
            let friendlyText = "⚠️ Gemini AI encountered an issue processing your request. Please try again.";

            if (errStr.includes("429") || errStr.includes("quota") || errStr.includes("rate limit")) {
              friendlyText = "⚠️ Gemini AI free quota/rate limit reached. Please wait ~30 seconds and try again.";
            } else if (errStr.includes("503") || errStr.includes("high demand") || errStr.includes("unavailable")) {
              friendlyText = "⚠️ Gemini AI is currently experiencing high server traffic. Please try again in a moment.";
            }

            const savedAiErrorMsg = await saveMessage({
              projectId: socket.project._id,
              senderId: null,
              senderName: "Gemini 2.5 AI",
              type: "ai",
              message: friendlyText,
            });

            io.to(projectRoomId).emit("project-message", savedAiErrorMsg);
          } finally {
            io.to(projectRoomId).emit("project-ai-thinking", { isThinking: false });
          }
        }
      } catch (error) {
        io.to(projectRoomId).emit("project-ai-thinking", { isThinking: false });
        reportSocketError("project-message", acknowledge, error);
      }
    });

    socket.on("project-message-edit", async (data, acknowledge) => {
      try {
        const { id, message } = data || {};
        const updated = await editMessageById({
          messageId: id,
          message,
          userId: socket.user._id,
          projectId: socket.project._id,
        });
        io.to(projectRoomId).emit("project-message-edit", { id, message: updated.message });
        acknowledge?.({ success: true });
      } catch (error) {
        reportSocketError("project-message-edit", acknowledge, error);
      }
    });

    socket.on("project-message-delete", async (data, acknowledge) => {
      try {
        const { id } = data || {};
        await deleteMessageById({
          messageId: id,
          userId: socket.user._id,
          projectId: socket.project._id,
        });
        io.to(projectRoomId).emit("project-message-delete", { id });
        acknowledge?.({ success: true });
      } catch (error) {
        reportSocketError("project-message-delete", acknowledge, error);
      }
    });

    socket.on("project-message-pin", async (data, acknowledge) => {
      try {
        const { id } = data || {};
        const updated = await togglePinMessageById({
          messageId: id,
          projectId: socket.project._id,
        });
        io.to(projectRoomId).emit("project-message-pin", {
          id,
          isPinned: updated.isPinned,
          pinnedAt: updated.pinnedAt,
        });
        acknowledge?.({ success: true });
      } catch (error) {
        reportSocketError("project-message-pin", acknowledge, error);
      }
    });

    socket.on("project-message-react", async (data, acknowledge) => {
      try {
        const { id, emoji } = data || {};
        const updated = await toggleReactionOnMessage({
          messageId: id,
          emoji,
          userId: socket.user._id,
          username: socket.user.username,
        });
        io.to(projectRoomId).emit("project-message-react", {
          id,
          reactions: updated.reactions,
        });
        acknowledge?.({ success: true });
      } catch (error) {
        reportSocketError("project-message-react", acknowledge, error);
      }
    });

    socket.on("project-files-apply", async (data, acknowledge) => {
      try {
        const { fileTree, buildCommand, startCommand } = data || {};
        const updatedProject = await setFileTree({
          projectId: socket.project._id,
          fileTree,
          buildCommand,
          startCommand,
        });

        socket.project.fileTree = updatedProject.fileTree;

        io.to(projectRoomId).emit("project-files-updated", {
          fileTree: updatedProject.fileTree,
          buildCommand: updatedProject.buildCommand,
          startCommand: updatedProject.startCommand,
        });

        acknowledge?.({ success: true });
      } catch (error) {
        reportSocketError("project-files-apply", acknowledge, error);
      }
    });

    // Git-style PR Event Handlers
    socket.on("project-pr-submit", (prPayload) => {
      io.to(projectRoomId).emit("project-pr-received", prPayload);
    });

    socket.on("project-pr-approve", (data) => {
      const { prId } = data || {};
      io.to(projectRoomId).emit("project-pr-[#merged]", { prId });
    });

    socket.on("project-pr-reject", (data) => {
      const { prId } = data || {};
      io.to(projectRoomId).emit("project-pr-[#rejected]", { prId });
    });

    socket.on("project-editor-presence", (data) => {
      const presenceMap = getProjectPresence(projectRoomId);
      if (!data?.filePath) {
        presenceMap.delete(socket.id);
      } else {
        presenceMap.set(socket.id, {
          socketId: socket.id,
          userId: socket.user._id,
          username: socket.user.username,
          profilePic: socket.user.profilePic,
          colorIndex: getPresenceColorIndex(socket.user._id),
          filePath: data.filePath,
          cursor: data.cursor,
        });
      }
      io.to(projectRoomId).emit(
        "project-editor-presence-sync",
        Array.from(presenceMap.values()),
      );
    });

    socket.on("project-typing", (data) => {
      socket.to(projectRoomId).emit("project-typing", {
        userId: socket.user._id,
        username: socket.user.username,
        isTyping: Boolean(data?.isTyping),
      });
    });

    socket.on("disconnect", () => {
      const presenceMap = getProjectPresence(projectRoomId);
      if (presenceMap.delete(socket.id)) {
        io.to(projectRoomId).emit(
          "project-editor-presence-sync",
          Array.from(presenceMap.values()),
        );
      }
      // Broadcast typing stopped for disconnected user
      socket.to(projectRoomId).emit("project-typing", {
        userId: socket.user._id,
        username: socket.user.username,
        isTyping: false,
      });
    });
  });
};

module.exports = { setupProjectSockets };
