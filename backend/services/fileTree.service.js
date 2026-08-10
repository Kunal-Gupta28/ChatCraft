const mongoose = require("mongoose");
const projectModel = require("../models/project.model");
const { getFileNode, normalizeFileTree } = require("../utils/fileTree");

// setting the file tree data in project database
module.exports.setFileTree = async ({
  projectId,
  fileTree,
  buildCommand,
  startCommand,
  userId,
}) => {
  if (!projectId || !fileTree)
    throw new Error("project id or fileTree is required");

  if (!mongoose.Types.ObjectId.isValid(projectId))
    throw new Error("Invalid project id");

  const update = { fileTree: normalizeFileTree(fileTree) };
  if (buildCommand) update.buildCommand = buildCommand;
  if (startCommand) update.startCommand = startCommand;

  const query = userId ? { _id: projectId, users: userId } : { _id: projectId };
  return projectModel.findOneAndUpdate(query, update, { new: true });
};

// updating specific file in filetree ( in project database )
module.exports.updateFileTree = async ({
  projectId,
  updatedfile,
  newCode,
  userId,
}) => {
  if (!projectId || !updatedfile)
    throw new Error("project id or updated file is required");

  if (!mongoose.Types.ObjectId.isValid(projectId))
    throw new Error("Invalid project id");

  const project = await projectModel.findOne({
    _id: projectId,
    users: userId,
  });
  if (!project) throw new Error("Project not found or user not authorized");

  project.fileTree = normalizeFileTree(project.fileTree);

  const fileNode = getFileNode(project.fileTree, updatedfile);
  if (!fileNode) {
    throw new Error("File not found in fileTree");
  }

  fileNode.file.contents = newCode;
  project.markModified("fileTree");

  await project.save();
  return project;
};
