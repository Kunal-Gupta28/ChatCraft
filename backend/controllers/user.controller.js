const { validationResult } = require("express-validator");
const userService = require("../services/user.service");
const userModel = require("../models/user.model");
const redisClient = require("../services/redis.service");

const isProduction = process.env.NODE_ENV === "production";
console.log(process.env.NODE_ENV)
console.log(isProduction)
// common cookie config
const cookieOptions = {
  httpOnly: isProduction,
  secure: isProduction,
  sameSite: "lax",
  maxAge: 1000 * 60 * 60,
};

// register an user
module.exports.registerController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    const { user, token } = await userService.createUser({
      username,
      email,
      password,
    });

    if (!user) {
      return res.status(409).json({ error: "User already exists" });
    }
    // cookie
    res.cookie("token", token, cookieOptions);

    res.status(201).json({ message: "user registered sucessfully", user , token });
  } catch (error) {
    return res.status(400).json({ "internal error": error });
  }
};

// login the user
module.exports.loginController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const { user, token } = await userService.login({ email, password });

    if (!user || !token) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // cookie
    res.cookie("token", token, cookieOptions );
    return res.status(200).json({ user: user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// update avatar in database
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
    const isLoggedInUser = await userModel.findOne({ email: req.user.email });
console.log("req.user",req.user)
    if (!isLoggedInUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const allUsers = await userService.getAllUser({
      userId: isLoggedInUser._id,
    });
    return res.status(200).json({ allUsers });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// get me
module.exports.getMe = async (req, res) => {
  try {
    const user = await userService.getMe({ email: req.user.email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("GetMe Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// logout
module.exports.logout = async (req, res) => {
  try {
    const authHeader = req.header("Authorization");

    let token;

    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }

    // blacklist token
    await redisClient.set(`bl_${token}`, "1", "EX", 60 * 60 * 24);

    // clear cookie properly
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
