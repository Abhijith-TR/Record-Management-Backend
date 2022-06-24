const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"],
    minlength: 3,
  },
  entryNumber: {
    type: String,
    required: [true, "Please enter an entry number"],
    minlength: 11,
    unique: true,
    uppercase: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    minlength: 5,
  },
  degree: {
    type: String,
    required: [true, "Please enter the degree"],
    enum: ["B.Tech", "M.Tech", "PhD"],
    default: "B.Tech",
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: 8,
  },
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
      name: this.name,
      entryNumber: this.entryNumber,
      isAdmin: false,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const match = await bcrypt.compare(candidatePassword, this.password);
  return match;
};

module.exports = mongoose.model("User", UserSchema);
