const userModel = require("../models/user.model");

// check if user exists by email
module.exports.checkUserExists = async (email) => {
  const user = await userModel.findOne({ email });
  return !!user;
};

// create new user in database
module.exports.createUser = async (username, email, password ) => {
  if (!username || !email || !password) {
    throw new Error("Username, email, and password are required");
  }
  // checking for user is already registered or not
  const userExist = await userModel.findOne({ email });

  // if user already exist
  if (userExist) {
    throw new Error("An account with this email address already exists");
  }

  const hashPassword = await userModel.hashPassword(password);
  const user = await userModel.create({
    username,
    email,
    password: hashPassword,
  });

  // generate token
  const token = await user.generateToken();

  // deleting password and version key
  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

// login the authentic user
module.exports.login = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await userModel
    .findOne({ email })
    .select("profilePic username email +password");

  // if user not present
  if (!user) {
    throw new Error("No account found with this email address");
  }

  const isMatch = await user.isValidPassword(password);
  if (!isMatch) {
    throw new Error("Incorrect password. Please check and try again");
  }

  // deleting password from data
  const userObj = user.toObject();
  delete userObj.password;

  // generate token
  const token = await user.generateToken();

  return { user: userObj, token };
};

// set avatar in project database
module.exports.setAvatar = async ({ avatar, userId }) => {
  if (!avatar || !userId) {
    throw new Error("Avatar and userId are required");
  }

  const updatedUser = await userModel
    .findByIdAndUpdate(userId, { profilePic: avatar }, { new: true })
    .select("-password");
  return updatedUser;
};

// get the authenticated user
module.exports.getMe = async ({ userId }) => {
  const user = await userModel.findById(userId).select("-password");
  return user;
};

// get all user from database
module.exports.getAllUser = async ({ userId }) => {
  const users = await userModel
    .find({
      _id: { $ne: userId },
    })
    .select("-password");
  return users;
};

// reset password
module.exports.resetPassword = async ({ email, newPassword }) => {
  if (!email || !newPassword) {
    throw new Error("Email and new password are required");
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    throw new Error("No account found with this email address");
  }

  const hashPassword = await userModel.hashPassword(newPassword);
  user.password = hashPassword;
  await user.save();

  return { message: "Password reset successfully" };
};
