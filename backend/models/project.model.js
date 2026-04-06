const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
      unique: [true, "project name must be unique"],
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