const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"],
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    minlength: 8,
  },
});

AdminSchema.pre("save", async function () {
  const salt = await bcrypt.salt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

AdminSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

AdminSchema.methods.comparePassword = async function (candidatePassword) {
  const match = await bcrypt.compare(candidatePassword, this.password);
  return match;
};

module.exports = mongoose.model("Admin", AdminSchema);
