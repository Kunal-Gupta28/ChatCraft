const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  profilePic: {
    type:String,
    default: null,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minLength: [7,"minimum length of an email should be 7 letters"],
    maxLength: [50,"maximum length of an email should be 50 letters"],
  },
  password: {
    type: String,
    required: true,
    select: false
  },
});


// hashing the password
userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password,10)
}

// comparing the password
userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password,this.password)
}

// token generate
userSchema.methods.generateToken = async function () {
    return jwt.sign({email: this.email},process.env.JWT_SECRET,{
      expiresIn:'24h'
    })
}

const User = mongoose.model("User", userSchema);
module.exports = User;
