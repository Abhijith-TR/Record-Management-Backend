const { findOne, create, deleteOne } = require("../models/admin");
const { updateMany } = require("../models/data");
const { deleteMany } = require("../models/announcements");
const { Types } = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError, NotFoundError } = require("../errors");

/**
 * This function is used to login an admin. It checks if the email and password 
 * are valid and if they are, it returns a token to the user.
 */
const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please enter valid username and password");
  }
  const admin = await findOne({ email });
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

/**
 * This function is used to register a new admin. It checks if the email is valid
 * and if it is, it creates a new admin with the given email and password.
 */
const adminRegister = async (req, res) => {
  const { name, email } = req.body;
  const password = process.env.PASS;
  const admin = await create({ name, email, password });
  res.status(StatusCodes.CREATED).send({ msg: "Admin created" });
};

/**
 * This function is used to remove an admin. It checks if the email is valid
 * and if it is, it deletes the admin with the given email. It also deletes all
 * the records created by the admin and all the notifications posted by the admin.
 * This is to ensure that the data is not lost when an admin is removed. 
 * Instead, the data is retained and the createdBy field is updated to the super 
 * admin.
 */
const adminRemove = async (req, res) => {
  const { email } = req.params;
  const check = await findOne({ email });
  const val = check._id;
  const replace = new Types.ObjectId(req.user.adminId);
  const data = await updateMany(
    { createdBy: val },
    { createdBy: replace },
    { runValidators: true, new: true }
  );
  const notif = await deleteMany({ createdBy: val });
  const admin = await deleteOne({ email });
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
