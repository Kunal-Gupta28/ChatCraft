// services/message.service.js

const Message = require("../models/message.model");
const projectModel = require("../models/project.model");

const normalizeMessage = (message) => {
  const raw = message?.message;
  const content =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? raw.text || JSON.stringify(raw)
      : raw;

  return {
    _id: message._id,
    projectId: message.projectId,
    senderId: message.senderId,
    senderName: message.senderName,
    type: message.type || (message.senderName === "AI" ? "ai" : "user"),
    message: content || "",
    createdAt: message.createdAt || message.timestamp || new Date(),
  };
};

module.exports.saveMessage = async ({
  projectId,
  senderId,
  senderName,
  type,
  message,
}) => {
  const savedMessage = await Message.create({
    projectId,
    senderId,
    senderName,
    type,
    message,
  });

  return normalizeMessage(savedMessage.toObject());
};

module.exports.getProjectMessages = async ({ projectId, userId }) => {
  const project = await projectModel.exists({ _id: projectId, users: userId });
  if (!project) throw new Error("Project not found or user not authorized");

  const messages = await Message.find({ projectId })
    .sort({ createdAt: 1 })
    .lean();

  return messages.map(normalizeMessage);
};

module.exports.normalizeMessage = normalizeMessage;
