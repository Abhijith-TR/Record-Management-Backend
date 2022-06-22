const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");

const login = async (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase();
  if (!email || !password) {
    throw new Error("Enter email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("No such user found");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new Error("Incorrect password");
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ email, token });
};

const register = async (req, res) => {
  const { name, entryNumber, degree } = req.body;
  const email = entryNumber + "@iitrpr.ac.in";
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
  login,
  register,
};
