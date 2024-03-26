const User = require("../models/user");
const Data = require("../models/data");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");

/**
  * This function is used to login a user. It checks if the email and password are
  * valid and if they are, it logs in the user and returns a token. If the user is
  * not found or the password is incorrect, it returns an error.
  */
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
  res.status(StatusCodes.OK).json({ email, token, isAdmin: 0 });
};

/**
 * This function is used to register a user. It checks if the name, entry number and
 * degree are valid and if they are, it creates a new user with the given name, entry
 * number, degree, email and password.
 */
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

/**
 * This function is used to remove a user. It checks if the entry number is valid and
 * if it is, it deletes the user and all the records associated with that user. If the
 * user is not found, it returns an error.
 */
const userRemove = async (req, res) => {
  const { entryNumber } = req.params;
  if (typeof entryNumber === undefined) {
    throw new BadRequestError("Invalid entry number");
  }
  const user = await User.deleteOne({ entryNumber });
  if (user.deletedCount === 0) {
    throw new NotFoundError("No such user found");
  }
  const data = await Data.deleteMany({ entryNumber });
  res.status(StatusCodes.OK).json({ msg: "User and records deleted" });
};

module.exports = {
  userLogin,
  userRegister,
  userRemove,
};
