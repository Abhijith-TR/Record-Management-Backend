const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../errors");

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  return res.status(StatusCodes.BAD_REQUEST).json({ msg: err.message });
};

module.exports = errorHandler;
