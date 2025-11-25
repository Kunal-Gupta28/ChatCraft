const mongoose = require("mongoose");

// connect to database
const connectToDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("✅ Connected to database");
    })
    .catch((error) => {
      console.error("❌ Failed to connect to database:", error);
      process.exit(1);
    });
};

module.exports = connectToDB;
