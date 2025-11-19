const mongoose = require("mongoose");
const projectModel = require("../models/project.model");

// CREATE PROJECT
module.exports.createProject = async ({ name, userId }) => {
  if (!name) throw new Error("name is required");
  if (!userId) throw new Error("user Id is required");

  try {
    const project = await projectModel.create({
      name,
      owner: userId,
      users: [userId],
    });

    return project;
  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.name) {
      throw new Error("Project name already exists");
    }
    throw err;
  }
};

// GET ALL PROJECTS OF USER
module.exports.getAllProjectByUserId = async ({ userId }) => {
  if (!userId) throw new Error("user id is required");

  return projectModel.find({ users: userId }).populate("users");
};

// ADD USER TO PROJECT
module.exports.addUserToProject = async ({ projectId, users, userId }) => {
  if (!projectId || !userId) throw new Error("Missing projectId or userId");

  if (!mongoose.Types.ObjectId.isValid(projectId))
    throw new Error("Invalid project id");
  if (!mongoose.Types.ObjectId.isValid(userId))
    throw new Error("Invalid user id");

  if (!Array.isArray(users) || users.length === 0)
    throw new Error("Users array is empty");

  if (users.some((u) => !mongoose.Types.ObjectId.isValid(u)))
    throw new Error("Invalid userId in users");

  // ensure user is part of project (authorization)
  const project = await projectModel.findOne({
    _id: projectId,
    users: userId,
  });

  if (!project) throw new Error("Project not found or user not authorized");

  const updatedProject = await projectModel
    .findByIdAndUpdate(
      projectId,
      { $addToSet: { users: { $each: users } } },
      { new: true }
    )
    .populate("users");

  return updatedProject;
};

// REMOVE USER FROM PROJECT
module.exports.removeUserFromProject = async ({ projectId, userId }) => {
  if (!projectId || !userId) throw new Error("Missing projectId or userId");

  if (!mongoose.Types.ObjectId.isValid(projectId))
    throw new Error("Invalid project id");
  if (!mongoose.Types.ObjectId.isValid(userId))
    throw new Error("Invalid user id");

  const project = await projectModel.findById(projectId);
  if (!project) throw new Error("Project not found");

  return projectModel
    .findByIdAndUpdate(projectId, { $pull: { users: userId } }, { new: true })
    .populate("users");
};

// GET PROJECT BY ID
module.exports.getProjectById = async ({ projectId }) => {
  if (!projectId) throw new Error("project id is required");
  if (!mongoose.Types.ObjectId.isValid(projectId))
    throw new Error("Invalid project id");

  return projectModel.findById(projectId).populate("users");
};

// SET FILE TREE
module.exports.setFileTree = async ({ projectId, fileTree }) => {
  if (!projectId || !fileTree)
    throw new Error("project id or fileTree is required");

  if (!mongoose.Types.ObjectId.isValid(projectId))
    throw new Error("Invalid project id");

  return projectModel.findByIdAndUpdate(projectId, { fileTree }, { new: true });
};

// UPDATE SPECIFIC FILE IN FILE TREE
module.exports.updateFileTree = async ({ projectId, updatedfile, newCode }) => {
  if (!projectId || !updatedfile)
    throw new Error("project id or updated file is required");

  if (!mongoose.Types.ObjectId.isValid(projectId))
    throw new Error("Invalid project id");

  const project = await projectModel.findById(projectId);
  if (!project) throw new Error("Project not found");

  // Check if file exists
  if (!project.fileTree[updatedfile]) {
    throw new Error("File not found in fileTree");
  }

  // Check structure
  if (!project.fileTree[updatedfile].file) {
    throw new Error("Invalid file structure. Missing .file object.");
  }

  // Update file contents
  project.fileTree[updatedfile].file.contents = newCode;

  // MUST add this because fileTree is a plain object
  project.markModified("fileTree");

  await project.save();

  return project;
};
