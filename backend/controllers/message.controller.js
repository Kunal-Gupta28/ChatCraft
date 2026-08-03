const { getProjectMessages } = require("../services/message.service");
const { validationResult } = require("express-validator");
const asyncHandler = require("../utils/asyncHandler");

module.exports.getProjectMessagesController = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { projectId } = req.params;
  const { page = 1, limit = 20, search = "", filter = "all" } = req.query;

  const result = await getProjectMessages({
    projectId,
    userId: req.user.userId,
    page,
    limit,
    search,
    filter,
  });

  return res.status(200).json({
    success: true,
    messages: result.messages,
    pagination: result.pagination,
  });
});
