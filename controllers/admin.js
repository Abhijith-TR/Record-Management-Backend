const Admin = require("../models/admin");
const Data = require("../models/data");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please enter valid username and password");
  }
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new UnauthenticatedError("Access Denied");
  }
  const isPasswordCorrect = await admin.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Username or Password");
  }
  const token = admin.createJWT();
  let isAdmin;
  if (admin.superAdmin) isAdmin = 2;
  else isAdmin = 1;
  res.status(StatusCodes.OK).json({ email, token, isAdmin });
};

const adminRegister = async (req, res) => {
  const { name, email } = req.body;
  const password = process.env.PASS;
  const admin = await Admin.create({ name, email, password });
  res.status(StatusCodes.CREATED).send({ msg: "Admin created" });
};

const adminRemove = async (req, res) => {
  const { email } = req.params;
  const check = await Admin.findOne({ email });
  const val = check._id;
  const replace = new mongoose.Types.ObjectId(req.user.adminId);
  const data = await Data.updateMany(
    { createdBy: val },
    { createdBy: replace },
    { runValidators: true, new: true }
  );
  const admin = await Admin.deleteOne({ email });
  if (admin.deletedCount === 0) {
    throw new NotFoundError("Admin not found with given email");
  }
  res.status(StatusCodes.OK).json({ msg: "Admin removed" });
};

module.exports = {
  adminLogin,
  adminRegister,
  adminRemove,
};
