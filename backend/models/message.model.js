// models/message.model.js

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    senderName: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["user", "ai", "audio"],
      default: "user",
    },

    message: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    codeSuggestion: {
      type: mongoose.Schema.Types.Mixed,
      default: undefined,
    },

    audioUrl: {
      type: String,
      default: null,
    },

    audioDuration: {
      type: Number,
      default: null,
    },

    isPinned: {
      type: Boolean,
      default: false,
    },

    pinnedAt: {
      type: Date,
      default: null,
    },

    replyTo: {
      id: { type: String, default: null },
      senderName: { type: String, default: null },
      text: { type: String, default: null },
    },

    reactions: [
      {
        emoji: { type: String, required: true },
        userId: { type: String, required: true },
        username: { type: String, default: "" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
