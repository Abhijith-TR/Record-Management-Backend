const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const { UnauthenticatedError, BadRequestError } = require("../errors");

/**
 * This function is used to change the user password. It checks if the password
 * is valid and if it is, it updates the password with the new password.
 */
const changeUserPassword = async (req, res) => {
  let { password, newPassword } = req.body;
  const { userId: _id, name } = req.user;
  if (!password) {
    throw new BadRequestError("Invalid Password");
  }
  const checkUser = await User.findById({ _id });
  const isPasswordCorrect = await checkUser.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Password Incorrect");
  }
  const salt = await bcrypt.genSalt(10);
  newPassword = await bcrypt.hash(newPassword, salt);
  const user = await User.updateOne(
    { _id, name },
    { password: newPassword },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!user) {
    throw new UnauthenticatedError("Invalid Username");
  }
  res.status(StatusCodes.OK).json({ msg: "Password updated" });
};

/**
 * This function is used to change the admin password. It checks if the password
 * is valid and if it is, it updates the password with the new password.
 */
const changeAdminPassword = async (req, res) => {
  let { password, newPassword } = req.body;
  const { adminId: _id, name } = req.user;
  if (!password) {
    throw new BadRequestError("Invalid Password");
  }
  const checkAdmin = await Admin.findById({ _id });
  const isPasswordCorrect = await checkAdmin.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Password Incorrect");
  }
  const salt = await bcrypt.genSalt(10);
  newPassword = await bcrypt.hash(newPassword, salt);
  const admin = await Admin.updateOne(
    { _id, name },
    { password: newPassword },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!admin) {
    throw new UnauthenticatedError("Invalid Username");
  }
  res.status(StatusCodes.OK).json({ msg: "Password updated" });
};

module.exports = {
  changeUserPassword,
  changeAdminPassword,
};
