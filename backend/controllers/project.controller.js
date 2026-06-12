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
const userModel = require("../models/user.model");

// create new project
module.exports.createController = async (req, res) => {
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { projectName } = req.body;
    const newProject = await createService({ projectName, userId: req.user.userId });
    return res.status(201).json({
      success: true,
      data: newProject,
    });
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
};

// get all project by using user Id
module.exports.getAllProject = async (req, res) => {
  try {
    const logInUser = await userModel.findOne({ email: req.user.email });
    const allProject = await getAllProjectByUserId({ userId: logInUser._id });
    return res.status(200).json({
      success: true,
      allProject: allProject,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// add user to project
module.exports.addUserToProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { projectId, users } = req.body;
    const isLoggedInUser = await userModel.findOne({ email: req.user.email });
    const updatedProject = await addUserToProject({
      projectId,
      users,
      userId: isLoggedInUser._id,
    });
    return res.status(200).json({
      success: true,
      message: "Users added to project successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// remove user from project
module.exports.removeUserFromProject = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { projectId, userId } = req.body;
    const updatedProject = await removeUserFromProject({ projectId, userId });
    return res.status(200).json({
      success: true,
      message: "User removed from project",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get project by useing project id
module.exports.getProjectById = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await getProjectById({
      projectId,
      userId: req.user.userId,
    });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or user not authorized",
      });
    }
    return res.status(200).json({ project });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update file tree content
module.exports.updateFileTree = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// rename proejct name in database
module.exports.renameProject = async (req, res) => {
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { projectId, newProjectName } = req.body;
    const updatedProjectName = await renameProject({
      projectId,
      newProjectName,
      userId:req.user.userId
    });

    return res.status(200).json({
      success: true,
      project: updatedProjectName,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete project from database
module.exports.deleteProject = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { projectId } = req.params;
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    const updatedProjectList = await deleteProject({
      projectId,
      userId: loggedInUser._id,
    });

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
   
