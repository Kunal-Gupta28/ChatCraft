const mongoose = require("mongoose");
const projectModel = require("../models/project.model");
const { getFileNode, normalizeFileTree } = require("../utils/fileTree");

// create project in database
module.exports.createService = async ({ projectName, userId }) => {
  if (!projectName) throw new Error("Project name is required");
  if (!userId) throw new Error("User Id is required");

  try {
    const project = await projectModel.create({
      projectName,
      owner: userId,
      users: [userId],
    });
    return {
      _id: project._id,
      projectName: project.projectName,
      owner: project.owner,
      memberCount: 1,
    };
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.projectName) {
      throw new Error(
        `"${projectName}" already exists. Please enter another name to create new project`,
      );
    }
    throw error;
  }
};

// get all project a particular user
module.exports.getAllProjectByUserId = async ({ userId }) => {
  if (!userId) throw new Error("user id is required");

  return projectModel.aggregate([
    {
      $match: { users: userId },
    },
    {
      $project: {
        _id: 1,
        projectName: 1,
        owner: 1,
        memberCount: {
          $size: { $ifNull: ["$users", []] },
        },
      },
    },
  ]);
};

// adding collaborators in a project
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

  const updatedProject = await projectModel.findByIdAndUpdate(
    projectId,
    { $addToSet: { users: { $each: users } } },
    { new: true },
  );

  return true;
};

// remove the user form the project
module.exports.removeUserFromProject = async ({ projectId, userId }) => {
  if (!projectId || !userId) {
    throw new Error("Missing projectId or userId");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project id");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user id");
  }

  const result = await projectModel.updateOne(
    { _id: projectId },
    { $pull: { users: userId } },
  );

  if (result.matchedCount === 0) {
    throw new Error("Project not found");
  }

  return true;
};

// get project by project id
module.exports.getProjectById = async ({ projectId, userId }) => {
  if (!projectId) throw new Error("project id is required");
  if (!userId) throw new Error("user id is required");

  if (!mongoose.Types.ObjectId.isValid(projectId))
    throw new Error("Invalid project id");

  const project = await projectModel
    .findOne({ _id: projectId, users: userId })
    .select(
      "_id projectName owner users fileTree buildCommand startCommand",
    )
    .populate("users", "_id profilePic username")
    .lean();

  if (!project) return null;
  return { ...project, fileTree: normalizeFileTree(project.fileTree) };
};

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

  // finding the project in database by proejct id
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

  // MUST add this because fileTree is a plain object
  project.markModified("fileTree");

  await project.save();

  return project;
};

// rename the proejct in database
module.exports.renameProject = async ({
  projectId,
  newProjectName,
  userId,
}) => {
  const trimmedName = newProjectName.trim();

  // trimmed the name
  if (!trimmedName) {
    throw new Error("Project name is required");
  }

  // checking for existance project
  const existingProject = await projectModel.findOne({ _id: projectId });

  // prject not exist
  if (!existingProject) {
    throw new Error("Project not found");
  }

  // prevent same-name rename
  if (existingProject.projectName === trimmedName) {
    throw new Error("Now project name cannot be same as old name");
  }

  try {
    const updatedProject = await projectModel.findByIdAndUpdate(
      projectId,
      { projectName: trimmedName },
      { new: true },
    );

    if (!updatedProject) throw new Error("Project not found");
    return updatedProject;
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.projectName) {
      throw new Error(
        `"${trimmedName}" already exists. Please enter another name`,
      );
    }
    throw error;
  }
};

// delete the proejct from the database
module.exports.deleteProject = async ({ projectId, userId }) => {
  if (!projectId) throw new Error("Project ID is required");
  if (!mongoose.Types.ObjectId.isValid(projectId))
    throw new Error("Invalid project ID");

  const project = await projectModel.findOne({
    _id: projectId,
    users: userId,
  });

  if (!project) throw new Error("Project not found or Unauthorized");

  const result = await projectModel.deleteOne({ _id: projectId });
  if (result.deletedCount === 0) {
    throw new Error("Deletion failed");
  }
  return true;
};
