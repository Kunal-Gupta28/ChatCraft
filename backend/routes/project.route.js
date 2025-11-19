const express = require('express')
const router = express.Router();
const {body} = require("express-validator")
const {createProject , getAllProject, addUserToProject, getProjectById , removeUserFromProject , updateFileTree} = require("../controllers/project.controller")
const {isLoggedIn} = require("../middlewares/auth.middleware")

// create new project
router.post('/create',
    isLoggedIn,
    body('name').isString().withMessage("Name is required"),
    createProject
);

// get all project
router.get('/all',isLoggedIn,getAllProject)

// add user to project
router.post('/add-user',
    isLoggedIn,
    body('projectId').isString().withMessage("project id must be a string"),
    body('users').isArray({ min: 1 }).withMessage("Users must be a non-empty array"),
    body('users.*').isString().withMessage("Each user must be a string"),
  addUserToProject
);

//  remove user from project
router.post('/remove-user',isLoggedIn,
  body('projectId').isString().withMessage("project id must be a string"),
  body('userId').isString().withMessage("user id must be a string"),
  removeUserFromProject
);

// get project
router.get('/get-project/:projectid',isLoggedIn,getProjectById)

// update file tree 
router.put("/update-file-tree",
  isLoggedIn,
  body('projectId').isString().withMessage("projectId is required"),
  body('updatedfile').isString().withMessage('updated file is required'),
  body('newCode').isString().withMessage("new code is required"),
  updateFileTree
)

module.exports= router;