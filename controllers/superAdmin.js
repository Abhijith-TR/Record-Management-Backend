const { StatusCodes } = require("http-status-codes");
const { UnauthenticatedError, BadRequestError } = require("../errors");
const Admin = require("../models/admin");

const registerSuper = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError("Please enter valid credentials");
  }
  const check = await Admin.findOne({ superAdmin: true });
  if (check) {
    throw new BadRequestError("One super admin already exists");
  }
  const admin = await Admin.create({ superAdmin: true, name, email, password });
  res.status(StatusCodes.CREATED).json({ msg: "Super Admin Created" });
};

module.exports = {
  registerSuper,
};
