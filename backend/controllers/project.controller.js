const projectModel = require("../models/project.model");
const {
  createService,
  getAllProjectByUserId,
  addUserToProject,
  removeUserFromProject,
  getProjectById,
  updateFileTree,
  renameProject,
  deleteProject,
} = require("../services/project.service");
const { validationResult } = require("express-validator");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// create new project
module.exports.createController = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { projectName } = req.body;
  const newProject = await createService({ projectName, userId: req.user.userId });
  return res.status(201).json({
    success: true,
    data: newProject,
  });
});

// get all project by using user Id (with server-side chunked pagination & search)
module.exports.getAllProject = asyncHandler(async (req, res) => {
  const { page = 1, limit = 9, search = "", sortBy = "date-newest" } = req.query;

  const result = await getAllProjectByUserId({
    userId: req.user.userId,
    page,
    limit,
    search,
    sortBy,
  });

  return res.status(200).json({
    success: true,
    allProject: result.projects,
    pagination: result.pagination,
  });
});

// add user to project
module.exports.addUserToProject = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { projectId, users } = req.body;
  await addUserToProject({
    projectId,
    users,
    userId: req.user.userId,
  });
  return res.status(200).json({
    success: true,
    message: "Users added to project successfully",
  });
});

// remove user from project
module.exports.removeUserFromProject = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { projectId, userId: userToRemoveId } = req.body;
  await removeUserFromProject({
    projectId,
    userToRemoveId,
    requestingUserId: req.user.userId,
  });
  return res.status(200).json({
    success: true,
    message: "User removed from project",
  });
});

// get project by using project id
module.exports.getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await getProjectById({
    projectId,
    userId: req.user.userId,
  });
  if (!project) {
    throw new AppError("Project not found or user not authorized", 404);
  }
  return res.status(200).json({ project });
});

// update file tree content
module.exports.updateFileTree = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { projectId, updatedfile, newCode } = req.body;
  const updatedProject = await updateFileTree({
    projectId,
    updatedfile,
    newCode,
    userId: req.user.userId,
  });
  return res.status(200).json({
    success: true,
    updatedfile,
    newCode,
    projectId: updatedProject._id,
  });
});

// rename project name in database
module.exports.renameProject = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { projectId, newProjectName } = req.body;
  const updatedProjectName = await renameProject({
    projectId,
    newProjectName,
    userId: req.user.userId,
  });

  return res.status(200).json({
    success: true,
    project: updatedProjectName,
  });
});

// delete project from database
module.exports.deleteProject = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { projectId } = req.params;
  await deleteProject({
    projectId,
    userId: req.user.userId,
  });

  return res.status(200).json({
    success: true,
    message: "Project deleted successfully",
  });
});
