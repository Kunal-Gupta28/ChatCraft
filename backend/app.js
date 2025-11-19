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

app.use("/", userRouter);
app.use("/project", projectRouter);
app.use("/ai", aiRouter);

module.exports = app;
