const jwt = require("jsonwebtoken");
const { BadRequestError } = require("../errors");

const authorizeAdmin = (req, res, next) => {
  const jsonToken = req.headers.authorization;
  if (!jsonToken || !jsonToken.startsWith("Bearer ")) {
    throw new BadRequestError("Access denied");
  }
  const token = jsonToken.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      adminId: payload.adminId,
      name: payload.name,
      isAdmin: payload.isAdmin,
    };
    next();
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

module.exports = authorizeAdmin;
