const express = require("express");
const { param } = require("express-validator");
const { getProjectMessagesController } = require("../controllers/message.controller");
const { isLoggedIn } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get(
  "/messages/:projectId",
  isLoggedIn,
  param("projectId").isMongoId().withMessage("Invalid project id"),
  getProjectMessagesController,
);

module.exports = router;
