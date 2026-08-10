const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: [true, "project name is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    owner: {
      type: String,
      required: true,
      index: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
      },
    ],
    fileTree: {
      type: Object,
      default: {},
    },
    buildCommand: {
      type: Object,
      default: undefined,
    },
    startCommand: {
      type: Object,
      default: undefined,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

projectSchema.index({ owner: 1, createdAt: -1 });
projectSchema.index({ users: 1, createdAt: -1 });

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
