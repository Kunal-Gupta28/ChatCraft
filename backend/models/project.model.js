const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: [true, "project name must be unique"],
    lowercase: true,
  },
  owner:{
    type: String,
    required: true,
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  fileTree : {
    type: Object,
    default: {}
  },
});


const project = mongoose.model("project", projectSchema)

module.exports = project;