const mongoose = require("mongoose");
const projectModel = require("../models/project.model");
const userModel = require("../models/user.model");

const ensureProjectOwner = async ({ projectId, userId }) => {
  const project = await projectModel.findById(projectId);
  if (!project) throw new Error("Project not found");
  const ownerStr = String(project.owner?._id || project.owner);
  const userStr = String(userId?._id || userId);
  if (ownerStr !== userStr) {
    const error = new Error("Only the project owner can perform this action");
    error.statusCode = 403;
    throw error;
  }
  return project;
};

module.exports.ensureProjectOwner = ensureProjectOwner;

const addUsersToProject = async ({ projectId, users, userId }) => {
  if (!projectId || !users || !Array.isArray(users) || users.length === 0) {
    throw new Error("User ids are required");
  }
  if (!mongoose.Types.ObjectId.isValid(projectId)) throw new Error("Invalid project id");
  if (!users.every((id) => mongoose.Types.ObjectId.isValid(id))) throw new Error("Invalid user id");

  await ensureProjectOwner({ projectId, userId });

  const userObjIds = users.map((id) => new mongoose.Types.ObjectId(id));
  const existingUsers = await userModel.find({ _id: { $in: userObjIds } });
  if (existingUsers.length !== users.length) throw new Error("User not found");

  const updatedProject = await projectModel.findOneAndUpdate(
    { _id: projectId },
    { $addToSet: { users: { $each: userObjIds } } },
    { new: true },
  ).populate("users", "_id profilePic username email");

  return updatedProject;
};

module.exports.addUsersToProject = addUsersToProject;
module.exports.addUserToProject = addUsersToProject;

module.exports.removeUserFromProject = async ({ projectId, userToRemoveId, requestingUserId }) => {
  if (!projectId || !userToRemoveId || !requestingUserId) {
    throw new Error("Missing projectId, userToRemoveId, or requestingUserId");
  }
  if (!mongoose.Types.ObjectId.isValid(projectId)) throw new Error("Invalid project id");
  if (!mongoose.Types.ObjectId.isValid(userToRemoveId)) throw new Error("Invalid userToRemoveId");
  if (!mongoose.Types.ObjectId.isValid(requestingUserId)) throw new Error("Invalid requesting user id");

  const project = await ensureProjectOwner({ projectId, userId: requestingUserId });
  if (String(project.owner) === String(userToRemoveId)) {
    const error = new Error("The project owner cannot be removed from the project");
    error.statusCode = 400;
    throw error;
  }

  const removeObjId = new mongoose.Types.ObjectId(userToRemoveId);
  const result = await projectModel.updateOne(
    { _id: projectId },
    { $pull: { users: { $in: [removeObjId, userToRemoveId] } } },
  );

  if (result.matchedCount === 0) throw new Error("Project not found");
  return true;
};
