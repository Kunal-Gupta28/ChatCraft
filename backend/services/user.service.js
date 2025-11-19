const userModel = require("../models/user.model");

// create new user
module.exports.createUser = async ({ username, email, password }) => {
  try {
    if (!username || !email || !password) {
      throw new Error("username , email and password are missing");
    }
    const hashPassword = await userModel.hashPassword(password);

    // checking for user is already registered or not
    const userExist = await userModel.findOne({ email });

    if (userExist) {
      return null
    } 
      const user = await userModel.create({
        username:username,
        email:email,
        password:hashPassword
      })

    return user;
  } catch (error) {
    throw error;
  }
};

// login
module.exports.login = async({email,password})=>{
    if(!email || !password){
        throw new Error("email or password is requried")
    }

    try {
        const user = await userModel.findOne({email}).select("+password");
        if(!user){
            return null
        }

        const isMatch = await user.isValidPassword(password)
        if(!isMatch){
            return 'credentials are invalid'
        }

        const token = await user.generateToken();

        return {user,token}
        
    } catch (error) {
        throw error
    }
}

// get all user
module.exports.getAllUser = async ({userId})=>{
  const users = await userModel.find({
    _id:{$ne:userId}
  });
  return users;
}

// set avatar
module.exports.setAvatar = async ({ avatar, userId }) => {
  try {
    if (!avatar || !userId) {
      throw new Error("avatar and userId are required");
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { profilePic: avatar },
      { new: true }
    );

    return updatedUser;
  } catch (error) {
    throw error;
  }
};