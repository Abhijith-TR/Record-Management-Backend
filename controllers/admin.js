const Admin = require("../models/admin");
const Data = require("../models/data");
const Announcement = require("../models/announcements");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  // Check if email and password are available
  if (!email || !password) {
    throw new BadRequestError("Please enter valid username and password");
  }
  // Check if there exists an admin with the given email
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new UnauthenticatedError("Access Denied");
  }
  // Check if the admin has the proper password using instance methods of the model
  const isPasswordCorrect = await admin.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Username or Password");
  }
  // Once verified, create the JWT token and send the token to the client
  const token = admin.createJWT();
  // isAdmin = 2 implies super admin. isAdmin = 1 implies normal admin
  let isAdmin;
  if (admin.superAdmin) isAdmin = 2;
  else isAdmin = 1;
  res.status(StatusCodes.OK).json({ email, token, isAdmin });
};

const adminRegister = async (req, res) => {
  // We assume that the super admin enters valid credentials
  // to prevent mouse slips and such, there are minor road blocks placed in the front end application
  const { name, email } = req.body;
  const password = process.env.PASS;
  const admin = await Admin.create({ name, email, password });
  res.status(StatusCodes.CREATED).send({ msg: "Admin created" });
};

const adminRemove = async (req, res) => {
  // If there exists an admin with the given email, find the records that the admin has created
  // once you find these records, to prevent them from referring to a deleted admin
  // you can change the reference createdBy to the super admin
  const { email } = req.params;
  const check = await Admin.findOne({ email });
  const val = check._id;
  const replace = new mongoose.Types.ObjectId(req.user.adminId);
  const data = await Data.updateMany(
    { createdBy: val },
    { createdBy: replace },
    { runValidators: true, new: true }
  );
  // We delete all the notifications that the old admin has put up
  // Consider a case when an admin transfers to a different college. The student records must be retained, but the notifications posted by the admin will be deleted
  const notif = await Announcement.deleteMany({ createdBy: val });
  // check if the admin exists or not
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
