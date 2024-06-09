const express = require("express");
const bodyParser = require("body-parser");
// const authRouter = require("./routes/auth");
const globalErrorHandler = require("./controller/errController");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/home.html");
});
app.get("/forgetPassword", function (req, res) {
  res.sendFile(__dirname + "/public/forgetPassword.html");
});

app.get("/resetPassword/:token", function (req, res) {
  res.sendFile(__dirname + "/public/resetPassword.html");
});
app.get("/signup", function (req, res) {
  res.sendFile(__dirname + "/public/signup.html");
});
app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/public/login.html");
});
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use(globalErrorHandler);
module.exports = app;
