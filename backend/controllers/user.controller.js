const { validationResult } = require("express-validator");
const userService = require("../services/user.service");
const userModel = require("../models/user.model");
const redisClient = require("../services/redis.service");

// register
module.exports.registerController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    const user = await userService.createUser({ username, email, password });
    delete user._doc.password;

    if (!user) {
      return res.status(409).json({ error: "User already exists" });
    }

    const token = await user.generateToken();
    res
      .status(201)
      .json({ message: "user registered sucessfully", user, token });
  } catch (error) {
    return res.status(400).json({ "internal error": error });
  }
};

// login
module.exports.loginController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const userdata = await userService.login({ email, password });

    delete userdata.user._doc.password;

    if (!userdata) {
      return res.status(404).json("user doesn't exist");
    }
    return res.status(200).json({ user: userdata.user, token: userdata.token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// set avatar
module.exports.setAvatar = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { avatar, userId } = req.body;

  try {
    const updatedUser = await userService.setAvatar({ avatar, userId });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "Avatar updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// get all user
module.exports.getAllUser = async (req, res) => {
  try {
    const isLoggedInUser = await userModel.find({ email: req.user.email });
    const allUsers = await userService.getAllUser({
      userId: isLoggedInUser._id,
    });
    return res.status(200).json({ allUsers });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// logout
module.exports.logout = async (req, res) => {
  try {
    const authHeader = req.header("Authorization");
    const token =
      req.cookies?.token || (authHeader && authHeader.split(" ")[1]);

    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }

    // Blacklist token in Redis for 24 hours (token expiry should not exceed this)
    await redisClient.set(token, "Logged Out", "EX", 60 * 60 * 24);

    // Clear cookie if used
    res.clearCookie("token");

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
