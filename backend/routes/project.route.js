const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  createController,
  getAllProject,
  addUserToProject,
  getProjectById,
  removeUserFromProject,
  updateFileTree,
  renameProject,
  deleteProject,
} = require("../controllers/project.controller");
const { isLoggedIn } = require("../middlewares/auth.middleware");

// create new project
router.post(
  "/create",
  isLoggedIn,
  body("projectName")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Name is required"),
  createController,
);

// get all project
router.get("/all", isLoggedIn, getAllProject);

// add collaborator in project data
router.put(
  "/add-user",
  isLoggedIn,
  body("projectId").isString().withMessage("project id must be a string"),
  body("users")
    .isArray({ min: 1 })
    .withMessage("Users must be a non-empty array"),
  body("users.*").isString().withMessage("Each user must be a string"),
  addUserToProject,
);

//  remove collaborator from project data
router.put(
  "/remove-user",
  isLoggedIn,
  body("projectId").isString().withMessage("project id must be a string"),
  body("userId").isString().withMessage("user id must be a string"),
  removeUserFromProject,
);

// get project fromo database
router.get("/get-project/:projectId", isLoggedIn, getProjectById);

// update file tree in database
router.put(
  "/update-file-tree",
  isLoggedIn,
  body("projectId").isString().withMessage("projectId is required"),
  body("updatedfile").isString().withMessage("updated file is required"),
  body("newCode").isString().withMessage("new code is required"),
  updateFileTree,
);

// rename the project
router.put(
  "/rename",
  isLoggedIn,
  body("projectId").isMongoId().withMessage("Invalid project id"),
  body("newProjectName")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("New project name is must be a string")
    .isLength({ min: 1, max: 50 })
    .withMessage("Project name must be between 1 and 50 characters"),
  renameProject,
);

// delete the project from the database
router.delete("/delete/:projectId", isLoggedIn, deleteProject);

module.exports = router;

// if project doesnt exists rename
//  old name = new name
