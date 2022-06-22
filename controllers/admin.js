const Admin = require("../models/admin");
const { StatusCodes } = require("http-status-codes");

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error("Invalid email or password");
  }
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new Error("Access Denied");
  }
  const isPasswordCorrect = await admin.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new Error("Invalid username or password");
  }
  const token = admin.createJWT();
  res.status(StatusCodes.OK).json({ email, token });
};

const adminRegister = async (req, res) => {
  if (req.user.entryNumber === undefined) {
    return res.status(StatusCodes.FORBIDDEN).send({ msg: "Access Denied " });
  }
  const { name, email } = req.body;
  const password = process.env.PASS;
  const admin = await Admin.create({ name, email, password });
  res.status(StatusCodes.CREATED).send({ msg: "Admin created" });
};

module.exports = {
  adminLogin,
  adminRegister,
};
