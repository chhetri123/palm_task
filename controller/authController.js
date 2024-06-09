const User = require("./../model/userModel");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const sendMail = require("./../utils/email");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const exp = require("constants");

const createSignToken = (user, res) => {
  user.password = undefined;
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_AT,
  });

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + Number(process.env.COOKIE_EXPIRES_AT) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "strict",
  });

  res.status(201).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !user.correctPassword(password, user.password)) {
    return next(new AppError("Invalid email or password", 200));
  }
  createSignToken(user, res);
});
exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  createSignToken(user, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token = null;
  if (req.headers["cookie"]) {
    token = req.headers["cookie"].split("=")[1];
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("Please login or Sign Up", 401));
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const user = await User.findById(decode.id);
  if (!user) {
    return next(new AppError("User belongs to this token does not exist"));
  }
  if (user.changePasswordAt(decode.iat)) {
    return next(
      new AppError("User recently changed password .Please login again"),
      401
    );
  }
  req.user = user;
  next();
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );
  if (!user) return next(new AppError("User Does Not Exist", 404));
  const resetToken = user.getResetToken();
  await user.save({ validateBeforeSave: false });
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/resetPassword/${resetToken}`;

  res.status(200).json({ status: "success", resetURL });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const resetToken = req.params.token;
  const token = crypto.createHash("sha256").update(resetToken).digest("hex");
  const user = await User.findOne({
    passwordResetToken: token,
    passwordTokenExpiresIn: { $gt: Date.now() },
  }).select("+password");
  if (!user) return next(new AppError("Invalid Token or Token Expired ", 401));
  user.password = req.body.password;
  user.conformPassword = req.body.conformPassword;
  user.passwordResetToken = undefined;
  user.passwordTokenExpiresIn = undefined;

  await user.save();
  createSignToken(user, res);
});

exports.isLoggedIn = (req, res, next) => {
  res.status(201).json({
    status: "success",
    user: req.user,
  });
};

exports.logout = (req, res) => {
  res.cookie("jwt", "", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    sameSite: "strict",
  });
  res.status(200).json({
    status: "success",
  });
};
