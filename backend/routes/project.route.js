const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  createProject,
  getAllProject,
  addUserToProject,
  getProjectById,
  removeUserFromProject,
  updateFileTree,
  renameProject,
  deleteProject
} = require("../controllers/project.controller");
const { isLoggedIn } = require("../middlewares/auth.middleware");

// create new project
router.post(
  "/create",
  isLoggedIn,
  body("name").isString().withMessage("Name is required"),
  createProject
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
  addUserToProject
);

//  remove collaborator from project data
router.put(
  "/remove-user",
  isLoggedIn,
  body("projectId").isString().withMessage("project id must be a string"),
  body("userId").isString().withMessage("user id must be a string"),
  removeUserFromProject
);

// get project fromo database
router.get("/get-project/:projectid", isLoggedIn, getProjectById);

// update file tree in database
router.put(
  "/update-file-tree",
  isLoggedIn,
  body("projectId").isString().withMessage("projectId is required"),
  body("updatedfile").isString().withMessage("updated file is required"),
  body("newCode").isString().withMessage("new code is required"),
  updateFileTree
);

// rename the project
router.put(
  "/rename",
  isLoggedIn,
  body("projectId").isString().withMessage("project Id is must be a string"),
  body("newName")
    .isString()
    .withMessage("new name of project is must be a string"),
  renameProject
);

// delete the project from the database
router.delete("/delete/:projectId", isLoggedIn, deleteProject);

module.exports = router;
