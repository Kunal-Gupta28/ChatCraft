const jwt = require("jsonwebtoken");
const redisClient = require("../services/redis.service");

module.exports.isLoggedIn = async (req, res, next) => {
  try {
    // 1. Get token from cookies or Authorization header
    const authHeader = req.header("Authorization");
    const token = req.cookies?.token || (authHeader && authHeader.split(" ")[1]);

    // 2. If no token, deny access
    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }
    // 3. Check if token is blacklisted
    const isBlackListed = await redisClient.get(token);
    if (isBlackListed) {
      res.clearCookie("token");
      return res.status(401).json({ error: "Unauthorized User" });
    }

    // 4. Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.clearCookie("token");
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Session expired. Please log in again." });
      }
      return res.status(401).json({ error: "Invalid token." });
    }
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
