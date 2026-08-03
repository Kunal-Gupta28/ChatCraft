const mongoose = require("mongoose");
const projectModel = require("../models/project.model");
const { getFileNode, normalizeFileTree } = require("../utils/fileTree");

// create project in database
module.exports.createService = async ({ projectName, userId }) => {
  if (!projectName) throw new Error("Project name is required");
  if (!userId) throw new Error("User Id is required");

  try {
    const project = await projectModel.create({
      projectName,
      owner: userId,
      users: [userId],
    });
    return {
      _id: project._id,
      projectName: project.projectName,
      owner: project.owner,
      memberCount: 1,
    };
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.projectName) {
      throw new Error(
        `"${projectName}" already exists. Please enter another name to create new project`,
      );
    }
    throw error;
  }
};

// get all project a particular user with server-side pagination & filtering
module.exports.getAllProjectByUserId = async ({
  userId,
  page = 1,
  limit = 9,
  search = "",
  sortBy = "date-newest",
}) => {
  if (!userId) throw new Error("user id is required");

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 9;
  const skipNum = (pageNum - 1) * limitNum;

  const userObjId = mongoose.Types.ObjectId.isValid(userId)
    ? new mongoose.Types.ObjectId(userId)
    : userId;
  const userStrId = String(userId);

  // Match condition for user projects & optional search
  const matchStage = {
    $or: [
      { users: userObjId },
      { users: userStrId },
      { owner: userStrId },
    ],
  };

  if (search && search.trim()) {
    matchStage.projectName = { $regex: search.trim(), $options: "i" };
  }

  // Sort condition
  let sortStage = { createdAt: -1, _id: -1 };
  if (sortBy === "date-oldest") sortStage = { createdAt: 1, _id: 1 };
  else if (sortBy === "name-asc") sortStage = { projectName: 1 };
  else if (sortBy === "name-desc") sortStage = { projectName: -1 };
  else if (sortBy === "members-desc") sortStage = { memberCount: -1 };
  else if (sortBy === "members-asc") sortStage = { memberCount: 1 };

  const pipeline = [
    { $match: matchStage },
    {
      $project: {
        _id: 1,
        projectName: 1,
        owner: 1,
        createdAt: 1,
        memberCount: {
          $size: { $ifNull: ["$users", []] },
        },
      },
    },
    { $sort: sortStage },
    {
      $facet: {
        metadata: [
          {
            $group: {
              _id: null,
              totalProjects: { $sum: 1 },
              ownedCount: {
                $sum: {
                  $cond: [
                    {
                      $or: [
                        { $eq: ["$owner", userStrId] },
                        { $eq: ["$owner", userObjId] },
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
              sharedCount: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $ne: ["$owner", userStrId] },
                        { $ne: ["$owner", userObjId] },
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ],
        projects: [{ $skip: skipNum }, { $limit: limitNum }],
      },
    },
  ];

  const [result] = await projectModel.aggregate(pipeline);

  const meta = result?.metadata?.[0] || {
    totalProjects: 0,
    ownedCount: 0,
    sharedCount: 0,
  };
  const projects = result?.projects || [];
  const totalPages = Math.max(1, Math.ceil(meta.totalProjects / limitNum));

  return {
    projects,
    pagination: {
      totalProjects: meta.totalProjects,
      ownedCount: meta.ownedCount,
      sharedCount: meta.sharedCount,
      totalPages,
      currentPage: pageNum,
      limit: limitNum,
    },
  };
};

const ensureProjectOwner = async ({ projectId, userId }) => {
  const project = await projectModel.findOne({
    _id: projectId,
    owner: String(userId),
  });

  if (!project) {
    const error = new Error("Only the project owner can manage collaborators");
    error.statusCode = 403;
    throw error;
  }

  return project;
};

// adding collaborators in a project
module.exports.addUserToProject = async ({ projectId, users, userId }) => {
  if (!projectId || !userId) throw new Error("Missing projectId or userId");

  if (!mongoose.Types.ObjectId.isValid(projectId))
    throw new Error("Invalid project id");
  if (!mongoose.Types.ObjectId.isValid(userId))
    throw new Error("Invalid user id");

  if (!Array.isArray(users) || users.length === 0)
    throw new Error("Users array is empty");

  if (users.some((u) => !mongoose.Types.ObjectId.isValid(u)))
    throw new Error("Invalid userId in users");

  await ensureProjectOwner({ projectId, userId });

  await projectModel.findOneAndUpdate(
    { _id: projectId, owner: String(userId) },
    { $addToSet: { users: { $each: users } } },
    { new: true },
  );

  return true;
};

// remove a collaborator from the project
module.exports.removeUserFromProject = async ({
  projectId,
  userToRemoveId,
  requestingUserId,
}) => {
  if (!projectId || !userToRemoveId || !requestingUserId) {
    throw new Error("Missing projectId, userToRemoveId, or requestingUserId");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project id");
  }

  if (!mongoose.Types.ObjectId.isValid(userToRemoveId)) {
    throw new Error("Invalid userToRemoveId");
  }

  if (!mongoose.Types.ObjectId.isValid(requestingUserId)) {
    throw new Error("Invalid requesting user id");
  }

  const project = await ensureProjectOwner({
    projectId,
    userId: requestingUserId,
  });

  if (String(project.owner) === String(userToRemoveId)) {
    const error = new Error("The project owner cannot be removed from the project");
    error.statusCode = 400;
    throw error;
  }

  const result = await projectModel.updateOne(
    { _id: projectId, owner: String(requestingUserId) },
    { $pull: { users: userToRemoveId } },
  );

  if (result.matchedCount === 0) {
    throw new Error("Project not found");
  }

  return true;
};

// get project by project id
module.exports.getProjectById = async ({ projectId, userId }) => {
  if (!projectId) throw new Error("project id is required");
  if (!userId) throw new Error("user id is required");

  if (!mongoose.Types.ObjectId.isValid(projectId))
    throw new Error("Invalid project id");

  const project = await projectModel
    .findOne({ _id: projectId, users: userId })
    .select(
      "_id projectName owner users fileTree buildCommand startCommand",
    )
    .populate("users", "_id profilePic username")
    .lean();

  if (!project) return null;
  return { ...project, fileTree: normalizeFileTree(project.fileTree) };
};

// setting the file tree data in project database
module.exports.setFileTree = async ({
  projectId,
  fileTree,
  buildCommand,
  startCommand,
  userId,
}) => {
  if (!projectId || !fileTree)
    throw new Error("project id or fileTree is required");

  if (!mongoose.Types.ObjectId.isValid(projectId))
    throw new Error("Invalid project id");

  const update = { fileTree: normalizeFileTree(fileTree) };
  if (buildCommand) update.buildCommand = buildCommand;
  if (startCommand) update.startCommand = startCommand;

  const query = userId ? { _id: projectId, users: userId } : { _id: projectId };
  return projectModel.findOneAndUpdate(query, update, { new: true });
};

// updating specific file in filetree ( in project database )
module.exports.updateFileTree = async ({
  projectId,
  updatedfile,
  newCode,
  userId,
}) => {
  if (!projectId || !updatedfile)
    throw new Error("project id or updated file is required");

  if (!mongoose.Types.ObjectId.isValid(projectId))
    throw new Error("Invalid project id");

  // finding the project in database by proejct id
  const project = await projectModel.findOne({
    _id: projectId,
    users: userId,
  });
  if (!project) throw new Error("Project not found or user not authorized");

  project.fileTree = normalizeFileTree(project.fileTree);

  const fileNode = getFileNode(project.fileTree, updatedfile);
  if (!fileNode) {
    throw new Error("File not found in fileTree");
  }

  fileNode.file.contents = newCode;

  // MUST add this because fileTree is a plain object
  project.markModified("fileTree");

  await project.save();

  return project;
};

// rename the proejct in database
module.exports.renameProject = async ({
  projectId,
  newProjectName,
  userId,
}) => {
  const trimmedName = newProjectName.trim();

  // trimmed the name
  if (!trimmedName) {
    throw new Error("Project name is required");
  }

  // Ensure only the project owner can rename the project.
  const existingProject = await projectModel.findOne({
    _id: projectId,
    owner: String(userId),
  });

  // Project does not exist or the user is not its owner.
  if (!existingProject) {
    const error = new Error("Only the project owner can rename this project");
    error.statusCode = 403;
    throw error;
  }

  // prevent same-name rename
  if (existingProject.projectName === trimmedName) {
    throw new Error("Now project name cannot be same as old name");
  }

  try {
    const updatedProject = await projectModel.findOneAndUpdate(
      { _id: projectId, owner: String(userId) },
      { projectName: trimmedName },
      { new: true },
    );

    if (!updatedProject) {
      const error = new Error("Only the project owner can rename this project");
      error.statusCode = 403;
      throw error;
    }
    return updatedProject;
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.projectName) {
      throw new Error(
        `"${trimmedName}" already exists. Please enter another name`,
      );
    }
    throw error;
  }
};

// delete the project from the database
module.exports.deleteProject = async ({ projectId, userId }) => {
  if (!projectId) throw new Error("Project ID is required");
  if (!mongoose.Types.ObjectId.isValid(projectId))
    throw new Error("Invalid project ID");

  const project = await projectModel.findOne({
    _id: projectId,
    owner: String(userId),
  });

  if (!project) {
    const error = new Error("Only the project owner can delete this project");
    error.statusCode = 403;
    throw error;
  }

  const result = await projectModel.deleteOne({
    _id: projectId,
    owner: String(userId),
  });
  if (result.deletedCount === 0) {
    throw new Error("Deletion failed");
  }
  return true;
};
