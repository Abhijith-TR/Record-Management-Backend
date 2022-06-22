const jwt = require("jsonwebtoken");

const authorize = (req, res, next) => {
  const jsonToken = req.headers.authorization;
  if (!jsonToken || !jsonToken.startsWith("Bearer ")) {
    throw new Error("Invalid token");
  }
  const token = jsonToken.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: payload.userId,
      name: payload.name,
      entryNumber: payload.entryNumber,
    };
    next();
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

module.exports = authorize;
