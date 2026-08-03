const { generateResult } = require("../services/ai.service");
const { setFileTree } = require("../services/project.service");
const asyncHandler = require("../utils/asyncHandler");

// getting result from AI
module.exports.getResult = asyncHandler(async (req, res) => {
  const { projectId, prompt } = req.query;

  // passing prompt to AI
  const result = await generateResult(prompt);

  // if result contains file tree then save it in database
  if (result.fileTree) {
    await setFileTree({
      projectId,
      fileTree: result.fileTree,
      buildCommand: result.buildCommand,
      startCommand: result.startCommand,
      userId: req.user.userId,
    });
  }

  return res.status(200).json({ result });
});
