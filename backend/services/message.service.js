// services/message.service.js

const Message = require("../models/message.model");
const projectModel = require("../models/project.model");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeMessage = (message) => {
  const raw = message?.message;
  const content =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? raw.text ?? JSON.stringify(raw)
      : raw;

  return {
    _id: message._id,
    projectId: message.projectId,
    senderId: message.senderId,
    senderName: message.senderName,
    type: message.type || (message.senderName === "AI" ? "ai" : "user"),
    message: content ?? "",
    audioUrl: message.audioUrl || null,
    audioDuration: Number.isFinite(message.audioDuration)
      ? message.audioDuration
      : null,
    codeSuggestion: message.codeSuggestion?.fileTree
      ? message.codeSuggestion
      : null,
    isPinned: Boolean(message.isPinned),
    pinnedAt: message.pinnedAt || message.updatedAt || message.createdAt || new Date(),
    replyTo: message.replyTo && message.replyTo.id ? message.replyTo : null,
    reactions: Array.isArray(message.reactions) ? message.reactions : [],
    createdAt: message.createdAt || message.timestamp || new Date(),
  };
};

module.exports.togglePinMessageById = async ({ messageId, projectId }) => {
  const msg = await Message.findOne({ _id: messageId, projectId });
  if (!msg) throw new Error("Message not found");
  msg.isPinned = !msg.isPinned;
  msg.pinnedAt = msg.isPinned ? new Date() : null;
  await msg.save();
  return normalizeMessage(msg.toObject());
};

module.exports.toggleReactionOnMessage = async ({ messageId, emoji, userId, username }) => {
  if (!messageId || !emoji || !userId) throw new Error("Missing parameters for reaction");

  const msg = await Message.findById(messageId);
  if (!msg) throw new Error("Message not found");

  if (!Array.isArray(msg.reactions)) {
    msg.reactions = [];
  }

  const userIdStr = String(userId);
  const existingIndex = msg.reactions.findIndex(
    (r) => r.emoji === emoji && String(r.userId) === userIdStr
  );

  if (existingIndex !== -1) {
    msg.reactions.splice(existingIndex, 1);
  } else {
    msg.reactions.push({ emoji, userId: userIdStr, username: username || "User" });
  }

  await msg.save();
  return normalizeMessage(msg.toObject());
};

module.exports.saveMessage = async ({
  projectId,
  senderId,
  senderName,
  type,
  message,
  replyTo,
  codeSuggestion,
  audioUrl,
  audioDuration,
}) => {
  const savedMessage = await Message.create({
    projectId,
    senderId,
    senderName,
    type,
    message,
    replyTo: replyTo && replyTo.id ? replyTo : undefined,
    codeSuggestion: codeSuggestion?.fileTree ? codeSuggestion : undefined,
    audioUrl: audioUrl || undefined,
    audioDuration: Number.isFinite(audioDuration) ? audioDuration : undefined,
  });

  return normalizeMessage(savedMessage.toObject());
};

module.exports.getProjectMessages = async ({
  projectId,
  userId,
  page = 1,
  limit = 20,
  search = "",
  filter = "all",
}) => {
  const project = await projectModel.exists({ _id: projectId, users: userId });
  if (!project) throw new Error("Project not found or user not authorized");

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 20;
  const normalizedFilter = ["all", "mentions", "pinned", "ai"].includes(filter)
    ? filter
    : "all";
  const queryParts = [{ projectId }];

  if (search.trim()) {
    queryParts.push({
      message: { $regex: escapeRegex(search.trim()), $options: "i" },
    });
  }

  if (normalizedFilter === "mentions") {
    queryParts.push({ message: { $regex: "@", $options: "i" } });
  } else if (normalizedFilter === "pinned") {
    queryParts.push({ isPinned: true });
  } else if (normalizedFilter === "ai") {
    queryParts.push({ type: "ai" });
  }

  const messageQuery =
    queryParts.length === 1 ? queryParts[0] : { $and: queryParts };

  const totalMessages = await Message.countDocuments(messageQuery);
  const totalPages = Math.max(1, Math.ceil(totalMessages / limitNum));

  const skipNum = (pageNum - 1) * limitNum;

  const rawMessages = await Message.find(messageQuery)
    .sort({ createdAt: -1 })
    .skip(skipNum)
    .limit(limitNum)
    .lean();

  // Reverse to display chronologically (oldest -> newest)
  const messages = rawMessages.reverse().map(normalizeMessage);

  return {
    messages,
    pagination: {
      totalMessages,
      totalPages,
      currentPage: pageNum,
      limit: limitNum,
      hasMore: pageNum < totalPages,
    },
  };
};

module.exports.deleteMessageById = async ({ messageId, userId, projectId }) => {
  if (!messageId) throw new Error("Message ID is required");

  const msg = await Message.findById(messageId);
  if (!msg) {
    throw new Error("Message not found");
  }

  if (projectId && String(msg.projectId) !== String(projectId)) {
    throw new Error("Message does not belong to this project");
  }

  const senderIdStr = msg.senderId ? String(msg.senderId) : null;
  const userIdStr = String(userId);

  if (senderIdStr && senderIdStr !== userIdStr) {
    throw new Error("Unauthorized to delete this message");
  }

  await Message.deleteOne({ _id: msg._id });
  return msg;
};

module.exports.editMessageById = async ({ messageId, message, userId, projectId }) => {
  if (!messageId) throw new Error("Message ID is required");

  const msg = await Message.findById(messageId);
  if (!msg) {
    throw new Error("Message not found");
  }

  if (projectId && String(msg.projectId) !== String(projectId)) {
    throw new Error("Message does not belong to this project");
  }

  const senderIdStr = msg.senderId ? String(msg.senderId) : null;
  const userIdStr = String(userId);

  if (senderIdStr && senderIdStr !== userIdStr) {
    throw new Error("Unauthorized to edit this message");
  }

  msg.message = message;
  await msg.save();
  return normalizeMessage(msg.toObject());
};

module.exports.normalizeMessage = normalizeMessage;
