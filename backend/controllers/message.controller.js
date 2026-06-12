const { getProjectMessages } = require("../services/message.service");
const { validationResult } = require("express-validator");

module.exports.getProjectMessagesController = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { projectId } = req.params;

    const messages = await getProjectMessages({
      projectId,
      userId: req.user.userId,
    });

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    const statusCode = error.message.includes("authorized") ? 403 : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};
