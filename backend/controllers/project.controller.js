const projectModel = require("../models/project.model");
const {
  createProject,
  getAllProjectByUserId,
  addUserToProject,
  removeUserFromProject,
  updateFileTree,
} = require("../services/project.service");
const { validationResult } = require("express-validator");
const userModel = require("../models/user.model");

// create new project
module.exports.createProject = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.send(400).json({ errors: errors.array() });
  }

  try {
    const { name } = req.body;
    const isLoggedInUser = await userModel.findOne({ email: req.user.email });
    const userId = isLoggedInUser._id;
    const newProject = await createProject({ name, userId });
    return res.status(201).json(newProject);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

// get all project by using user Id
module.exports.getAllProject = async (req, res) => {
  try {
    const logInUser = await userModel.findOne({ email: req.user.email });
    const allProject = await getAllProjectByUserId({ userId: logInUser._id });
    return res.status(200).json({ allProject });
  } catch (error) {
    return res.status(400).send(error.message);
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
    return res.status(200).json({ updatedProject });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
    return res.status(200).json({ updatedProject });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// get project by useing project id
module.exports.getProjectById = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await getProjectById({ projectId });
    return res.status(200).json({ project });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// update file tree content
module.exports.updateFileTree = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { projectId, updatedfile, newCode } = req.body;
  try {
    const updatedProject = await updateFileTree({
      projectId,
      updatedfile,
      newCode,
    });
    const updatedContent = updatedProject.fileTree[updatedfile].file.contents;
    return res.status(200).json(updatedContent);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
