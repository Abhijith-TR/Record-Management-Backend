const Admin = require("../models/admin");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

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
  res.status(StatusCodes.OK).json({ email, token });
};

const adminRegister = async (req, res) => {
  const { name, email } = req.body;
  const password = process.env.PASS;
  const admin = await Admin.create({ name, email, password });
  res.status(StatusCodes.CREATED).send({ msg: "Admin created" });
};

module.exports = {
  adminLogin,
  adminRegister,
};
