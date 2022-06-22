const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");

const changeUserPassword = async (req, res) => {
  let { password, newPassword } = req.body;
  const { userId: _id, name } = req.user;
  if (!password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Invalid password" });
  }
  const checkUser = await User.findById({ _id });
  const isPasswordCorrect = await checkUser.comparePassword(password);
  if (!isPasswordCorrect) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Incorrect password" });
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
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong" });
  }
  res.status(StatusCodes.OK).json({ msg: "Password updated" });
};

const changeAdminPassword = async (req, res) => {
  let { password, newPassword } = req.body;
  const { adminId: _id, name } = req.user;
  if (!password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Invalid password" });
  }
  const checkAdmin = await Admin.findById({ _id });
  const isPasswordCorrect = await checkAdmin.comparePassword(password);
  if (!isPasswordCorrect) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Incorrect password" });
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
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong" });
  }
  res.status(StatusCodes.OK).json({ msg: "Password updated" });
};

module.exports = {
  changeUserPassword,
  changeAdminPassword,
};
