const redisClient = require("./redis.service");
const { sendOTPEmail } = require("./email.service");

/**
 * Generate 6-digit numeric OTP
 */
const generate6DigitCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send and store OTP in Redis instantly with background email dispatch (0ms UI delay)
 */
const sendOTP = async ({ email, type, title, ttlSeconds = 30 }) => {
  const otpKey = `otp:${type}:${email.toLowerCase()}`;
  const otpCode = generate6DigitCode();

  // 1. Save OTP in Redis instantly (< 5ms)
  await redisClient.set(otpKey, otpCode, "EX", ttlSeconds);

  // 2. Dispatch Email asynchronously in background (non-blocking fire-and-forget)
  sendOTPEmail(email, otpCode, title).catch((err) => {
    console.error("[ASYNC EMAIL DISPATCH ERROR]:", err.message);
  });

  // 3. Return instant response to frontend (< 10ms)
  return { message: "OTP sent successfully" };
};

/**
 * Verify OTP from Redis
 */
const verifyOTP = async ({ email, type, otp }) => {
  const otpKey = `otp:${type}:${email.toLowerCase()}`;
  const storedOTP = await redisClient.get(otpKey);

  if (!storedOTP) {
    throw new Error("OTP has expired or was not requested. Please request a new OTP.");
  }

  if (storedOTP !== otp.trim()) {
    throw new Error("Invalid OTP code. Please check and try again.");
  }

  // Delete OTP after successful verification to prevent replay
  await redisClient.del(otpKey);
  return true;
};

module.exports = {
  sendOTP,
  verifyOTP,
};
