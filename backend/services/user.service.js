const userModel = require("../models/user.model");

// create new user in database
module.exports.createUser = async ({ username, email, password }) => {
  try {
    if (!username || !email || !password) {
      throw new Error("username , email and password are missing");
    }
    const hashPassword = await userModel.hashPassword(password);

    // checking for user is already registered or not
    const userExist = await userModel.findOne({ email });

    // if user already exist
    if (userExist) {
      return { user: null, token: null };
    }
    const user = await userModel.create({
      username: username,
      email: email,
      password: hashPassword,
    });

    // genrate token
    const token = await user.generateToken();

    // deleting password and verson key
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.__v;

    return { user: userObj, token };
  } catch (error) {
    throw error;
  }
};

// login the authentic user
module.exports.login = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("email or password is requried");
  }

  try {
    const user = await userModel
      .findOne({ email })
      .select("profilePic username email +password");

    // if user not present
    if (!user) {
      return { user: null, token: null };
    }

    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      return { user: null, token: null };
    }

    // deleting password from data
    const userObj = user.toObject();
    delete userObj.password;

    // genrate token
    const token = await user.generateToken();

    return { user: userObj, token };
  } catch (error) {
    throw error;
  }
};

// get all user from database
module.exports.getAllUser = async ({ userId }) => {
  const users = await userModel.find({
    _id: { $ne: userId },
  });
  return users;
};

// set avatar in projet database
module.exports.setAvatar = async ({ avatar, userId }) => {
  try {
    if (!avatar || !userId) {
      throw new Error("avatar and userId are required");
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { profilePic: avatar },
      { new: true },
    );

    return updatedUser;
  } catch (error) {
    throw error;
  }
};

// get me
module.exports.getMe = async (email) => {
  const user = await userModel.findOne(email).select("-password -__v");
  return user;
};
