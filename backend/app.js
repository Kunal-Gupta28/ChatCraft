const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.router");
const projectRouter = require("./routes/project.route");
const messageRouter = require("./routes/message.route");
const aiRouter = require("./routes/ai.route");
const connectToDB = require("./config/connectToDb");
const cors = require("cors");

connectToDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_DEV,
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Routes
app.use("/", userRouter);
app.use("/project", projectRouter);
app.use("/project", messageRouter);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const errorHandler = require("./middlewares/error.middleware");

// Error handling middleware
app.use(errorHandler);

module.exports = app;