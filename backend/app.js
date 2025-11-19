const express = require("express");
const app = express();
const userRouter = require("./routes/user.router");
const projectRouter = require("./routes/project.route");
const aiRouter = require("./routes/ai.route");
const connectToDB = require("./config/connectToDb");
const cors = require("cors");
connectToDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.CLIENT_URL_DEV],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Routes
app.use("/", userRouter);
app.use("/project", projectRouter);
app.use("/ai", aiRouter);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
