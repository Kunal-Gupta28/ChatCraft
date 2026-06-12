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
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    fileTree: {
      type: Object,
      default: {},
    },
  },
  {
    versionKey: false,
  }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;