const AppError = require("./../utils/appError");
const sendJWTHandleDB = () => {
  const message = `Invalid Token . Please log In`;
  return new AppError(message, 401);
};
const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const handleDuplicateKeyErrorDB = (err) => {
  const keys = Object.keys(err.keyValue).join(",");
  const message = `${keys} already exists`;
  return new AppError(message, 400);
};
const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = JSON.parse(JSON.stringify(err));
    if (error.message === "JsonWebTokenError") error = sendJWTHandleDB();
    if (error.code === 11000) error = handleDuplicateKeyErrorDB(error);
    sendProdError(error, res);
  }
  next();
};
