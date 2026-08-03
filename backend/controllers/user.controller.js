const { validationResult } = require("express-validator");
const userService = require("../services/user.service");
const otpService = require("../services/otp.service");
const redisClient = require("../services/redis.service");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// Direct Register Controller (Fallback / Legacy)
module.exports.registerController = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstErr = errors.array()[0]?.msg || "Invalid input";
    return res.status(400).json({ error: firstErr, message: firstErr, errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    const { user, token } = await userService.createUser(username, email, password);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
      token,
    });
  } catch (error) {
    if (error.message?.includes("already exists")) {
      throw new AppError(error.message, 409);
    }
    throw new AppError(error.message, 400);
  }
});

// Direct Reset Password Controller (Fallback / Legacy)
module.exports.resetPasswordController = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstErr = errors.array()[0]?.msg || "Invalid input";
    return res.status(400).json({ error: firstErr, message: firstErr, errors: errors.array() });
  }

  const { email, newPassword } = req.body;
  const result = await userService.resetPassword({ email, newPassword });

  return res.status(200).json({
    success: true,
    message: result.message,
  });
});

// Send OTP for Registration
module.exports.sendRegisterOTPController = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstErr = errors.array()[0]?.msg || "Invalid input";
    return res.status(400).json({ error: firstErr, message: firstErr, errors: errors.array() });
  }

  const { email } = req.body;
  const userExists = await userService.checkUserExists(email);
  if (userExists) {
    throw new AppError("An account with this email address already exists", 409);
  }

  await otpService.sendOTP({
    email,
    type: "register",
    title: "Registration Verification Code",
  });

  return res.status(200).json({
    success: true,
    message: "Verification code sent to your email address",
  });
});

// Verify OTP & Register User
module.exports.verifyRegisterOTPController = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstErr = errors.array()[0]?.msg || "Invalid input";
    return res.status(400).json({ error: firstErr, message: firstErr, errors: errors.array() });
  }

  const { username, email, password, otp } = req.body;

  // Verify OTP
  await otpService.verifyOTP({ email, type: "register", otp });

  // Create User
  const { user, token } = await userService.createUser(username, email, password);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    user,
    token,
  });
});

// Send OTP for Forgot Password
module.exports.sendForgotOTPController = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstErr = errors.array()[0]?.msg || "Invalid input";
    return res.status(400).json({ error: firstErr, message: firstErr, errors: errors.array() });
  }

  const { email } = req.body;
  const userExists = await userService.checkUserExists(email);
  if (!userExists) {
    throw new AppError("No account found with this email address", 404);
  }

  await otpService.sendOTP({
    email,
    type: "forgot",
    title: "Password Reset Verification Code",
  });

  return res.status(200).json({
    success: true,
    message: "Verification code sent to your email address",
  });
});

// Verify OTP Code for Forgot Password (Step 2)
module.exports.verifyForgotCodeController = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstErr = errors.array()[0]?.msg || "Invalid input";
    return res.status(400).json({ error: firstErr, message: firstErr, errors: errors.array() });
  }

  const { email, otp } = req.body;

  // Verify OTP from Redis (30s window)
  await otpService.verifyOTP({ email, type: "forgot", otp });

  return res.status(200).json({
    success: true,
    message: "OTP code verified successfully",
  });
});

// Verify OTP & Reset Password (Step 3)
module.exports.verifyForgotOTPController = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstErr = errors.array()[0]?.msg || "Invalid input";
    return res.status(400).json({ error: firstErr, message: firstErr, errors: errors.array() });
  }

  const { email, newPassword } = req.body;

  // Reset Password
  const result = await userService.resetPassword({ email, newPassword });

  return res.status(200).json({
    success: true,
    message: result.message,
  });
});

// login the user
module.exports.loginController = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstErr = errors.array()[0]?.msg || "Invalid email";
    return res.status(400).json({ error: firstErr, message: firstErr, errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const { user, token } = await userService.login({ email, password });

    if (!user || !token) {
      throw new AppError("Invalid email or password", 401);
    }

    return res.status(200).json({ user, token });
  } catch (error) {
    throw new AppError(error.message || "Invalid email or password", 401);
  }
});

// update avatar in database
module.exports.setAvatar = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstErr = errors.array()[0]?.msg || "Invalid input";
    return res.status(400).json({ error: firstErr, message: firstErr, errors: errors.array() });
  }

  const { avatar } = req.body;
  const updatedUser = await userService.setAvatar({
    avatar,
    userId: req.user.userId,
  });

  if (!updatedUser) {
    throw new AppError("User not found", 404);
  }

  return res.status(200).json({
    message: "Avatar updated successfully",
    user: updatedUser,
  });
});

// get me
module.exports.getMe = asyncHandler(async (req, res) => {
  const user = await userService.getMe({ userId: req.user.userId });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return res.status(200).json({ user });
});

// get all user
module.exports.getAllUser = asyncHandler(async (req, res) => {
  const allUsers = await userService.getAllUser({
    userId: req.user.userId,
  });
  return res.status(200).json({ allUsers });
});

// logout
module.exports.logout = asyncHandler(async (req, res) => {
  const authHeader = req.header("Authorization");

  let token;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(400).json({ error: "No token provided", message: "No token provided" });
  }

  // blacklist token
  await redisClient.set(`bl_${token}`, "1", "EX", 60 * 60 * 24);

  return res.status(200).json({ message: "Logged out successfully" });
});
