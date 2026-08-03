const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  registerController,
  loginController,
  sendRegisterOTPController,
  verifyRegisterOTPController,
  sendForgotOTPController,
  verifyForgotCodeController,
  verifyForgotOTPController,
  resetPasswordController,
  setAvatar,
  getAllUser,
  logout,
  getMe,
} = require("../controllers/user.controller");
const { isLoggedIn } = require("../middlewares/auth.middleware");

// Send Register OTP
router.post(
  "/send-register-otp",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email address is required")
      .isEmail()
      .withMessage("Please enter a valid email address (e.g., name@example.com)"),
  ],
  sendRegisterOTPController,
);

// Verify Register OTP & Create Account
router.post(
  "/verify-register-otp",
  [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email address is required")
      .isEmail()
      .withMessage("Please enter a valid email address (e.g., name@example.com)"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 4 })
      .withMessage("Password must be at least 4 characters long"),
    body("otp")
      .trim()
      .notEmpty()
      .withMessage("OTP is required")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be a 6-digit number"),
  ],
  verifyRegisterOTPController,
);

// Send Forgot Password OTP
router.post(
  "/send-forgot-otp",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email address is required")
      .isEmail()
      .withMessage("Please enter a valid email address (e.g., name@example.com)"),
  ],
  sendForgotOTPController,
);

// Verify Forgot Password OTP Code (Step 2 - 30s window)
router.post(
  "/verify-forgot-code",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email address is required")
      .isEmail()
      .withMessage("Please enter a valid email address (e.g., name@example.com)"),
    body("otp")
      .trim()
      .notEmpty()
      .withMessage("OTP is required")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be a 6-digit number"),
  ],
  verifyForgotCodeController,
);

// Verify Forgot Password OTP & Reset Password (Step 3)
router.post(
  "/verify-forgot-otp",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email address is required")
      .isEmail()
      .withMessage("Please enter a valid email address (e.g., name@example.com)"),
    body("newPassword")
      .trim()
      .notEmpty()
      .withMessage("New password is required")
      .isLength({ min: 4 })
      .withMessage("Password must be at least 4 characters long"),
  ],
  verifyForgotOTPController,
);

// Direct register route (fallback)
router.post(
  "/register",
  [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email address is required")
      .isEmail()
      .withMessage("Please enter a valid email address (e.g., name@example.com)"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 4 })
      .withMessage("Password must be at least 4 characters long"),
  ],
  registerController,
);

// Direct reset password route (fallback)
router.post(
  "/forgot-password",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email address is required")
      .isEmail()
      .withMessage("Please enter a valid email address (e.g., name@example.com)"),
    body("newPassword")
      .trim()
      .notEmpty()
      .withMessage("New password is required")
      .isLength({ min: 4 })
      .withMessage("Password must be at least 4 characters long"),
  ],
  resetPasswordController,
);

// login route
router.post(
  "/login",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email address is required")
      .isEmail()
      .withMessage("Please enter a valid email address (e.g., name@example.com)"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required"),
  ],
  loginController,
);

// set avatar
router.put(
  "/setAvatar",
  body("avatar")
    .trim()
    .notEmpty()
    .withMessage("Please select a valid avatar"),
  isLoggedIn,
  setAvatar,
);

// reload user data
router.get("/getMe", isLoggedIn, getMe);

// get all user
router.get("/all", isLoggedIn, getAllUser);

// logout route
router.get("/logout", isLoggedIn, logout);

module.exports = router;
