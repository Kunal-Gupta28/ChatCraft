const mongoose = require("mongoose");
const projectModel = require("../models/project.model");
const { normalizeFileTree } = require("../utils/fileTree");
const { setFileTree, updateFileTree } = require("./fileTree.service");
const { ensureProjectOwner, addUsersToProject, addUserToProject, removeUserFromProject } = require("./projectCollaborators.service");

module.exports.setFileTree = setFileTree;
module.exports.updateFileTree = updateFileTree;
module.exports.ensureProjectOwner = ensureProjectOwner;
module.exports.addUsersToProject = addUsersToProject;
module.exports.addUserToProject = addUserToProject;
module.exports.removeUserFromProject = removeUserFromProject;

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

// get all project a particular user with server-side pagination & filtering
module.exports.getAllProjectByUserId = async ({
  userId,
  page = 1,
  limit = 9,
  search = "",
  sortBy = "date-newest",
}) => {
  if (!userId) throw new Error("user id is required");

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 9;
  const skipNum = (pageNum - 1) * limitNum;

  const userObjId = mongoose.Types.ObjectId.isValid(userId)
    ? new mongoose.Types.ObjectId(userId)
    : userId;
  const userStrId = String(userId);

  const matchStage = {
    $or: [
      { users: userObjId },
      { users: userStrId },
      { owner: userStrId },
      { owner: userObjId },
    ],
  };

  if (search && search.trim()) {
    matchStage.projectName = { $regex: search.trim(), $options: "i" };
  }

  let sortStage = { createdAt: -1, _id: -1 };
  if (sortBy === "date-oldest") sortStage = { createdAt: 1, _id: 1 };
  else if (sortBy === "name-asc") sortStage = { projectName: 1 };
  else if (sortBy === "name-desc") sortStage = { projectName: -1 };
  else if (sortBy === "members-desc") sortStage = { memberCount: -1 };
  else if (sortBy === "members-asc") sortStage = { memberCount: 1 };

  const pipeline = [
    { $match: matchStage },
    {
      $project: {
        _id: 1,
        projectName: 1,
        owner: 1,
        createdAt: 1,
        updatedAt: 1,
        memberCount: { $size: { $ifNull: ["$users", []] } },
      },
    },
    { $sort: sortStage },
    {
      $facet: {
        metadata: [{ $count: "totalProjects" }],
        projects: [{ $skip: skipNum }, { $limit: limitNum }],
      },
    },
  ];

  const [result] = await projectModel.aggregate(pipeline);
  const totalProjects = result?.metadata[0]?.totalProjects || 0;
  const projects = result?.projects || [];
  const totalPages = Math.ceil(totalProjects / limitNum) || 1;

  return {
    projects,
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalProjects,
      limit: limitNum,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    },
  };
};

// get project by project id
module.exports.getProjectById = async ({ projectId, userId }) => {
  if (!projectId) throw new Error("project id is required");
  if (!userId) throw new Error("user id is required");

  if (!mongoose.Types.ObjectId.isValid(projectId))
    throw new Error("Invalid project id");

  const userObjId = mongoose.Types.ObjectId.isValid(userId)
    ? new mongoose.Types.ObjectId(userId)
    : userId;
  const userStrId = String(userId);

  const project = await projectModel
    .findOne({
      _id: projectId,
      $or: [
        { users: userObjId },
        { users: userStrId },
        { owner: userStrId },
        { owner: userObjId },
      ],
    })
    .select("_id projectName owner users fileTree buildCommand startCommand")
    .populate("users", "_id profilePic username email")
    .lean();

  if (!project) return null;
  return { ...project, fileTree: normalizeFileTree(project.fileTree) };
};

// rename the project in database
module.exports.renameProject = async ({
  projectId,
  newProjectName,
  userId,
}) => {
  const trimmedName = newProjectName.trim();

  if (!trimmedName) {
    throw new Error("Project name is required");
  }

  const existingProject = await projectModel.findOne({
    _id: projectId,
    owner: String(userId),
  });

  if (!existingProject) {
    const error = new Error("Only the project owner can rename this project");
    error.statusCode = 403;
    throw error;
  }

  if (existingProject.projectName === trimmedName) {
    throw new Error("Now project name cannot be same as old name");
  }

  try {
    const updatedProject = await projectModel.findOneAndUpdate(
      { _id: projectId, owner: String(userId) },
      { projectName: trimmedName },
      { new: true },
    );

    if (!updatedProject) {
      const error = new Error("Only the project owner can rename this project");
      error.statusCode = 403;
      throw error;
    }
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

// delete the project from the database
module.exports.deleteProject = async ({ projectId, userId }) => {
  if (!projectId) throw new Error("Project ID is required");
  if (!mongoose.Types.ObjectId.isValid(projectId))
    throw new Error("Invalid project ID");

  const project = await projectModel.findOne({
    _id: projectId,
    owner: String(userId),
  });

  if (!project) {
    const error = new Error("Only the project owner can delete this project");
    error.statusCode = 403;
    throw error;
  }

  const result = await projectModel.deleteOne({
    _id: projectId,
    owner: String(userId),
  });
  if (result.deletedCount === 0) {
    throw new Error("Deletion failed");
  }
  return true;
};
