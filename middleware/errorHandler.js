const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
  console.log(err);
  return res.status(StatusCodes.BAD_REQUEST).json({ msg: err });
};

module.exports = errorHandler;
