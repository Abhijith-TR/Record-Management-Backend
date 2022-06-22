const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const userLogin = async (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase();
  if (!email || !password) {
    throw new BadRequestError("Enter username and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Username or Password");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Username or Password");
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ email, token });
};

const userRegister = async (req, res) => {
  const { name, entryNumber, degree } = req.body;
  const email = entryNumber + process.env.COLLEGE;
  const password = entryNumber.toLowerCase();
  const user = await User.create({
    name,
    entryNumber,
    email,
    degree,
    password,
  });
  res.status(StatusCodes.CREATED).json({ msg: "User Created" });
};

module.exports = {
  userLogin,
  userRegister,
};
