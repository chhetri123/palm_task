const express = require("express");
const authController = require("./../controller/authController");
const router = express.Router();

//
router.route("/login").post(authController.login);
router.route("/signup").post(authController.signup);
router.route("/forgetPassword").post(authController.forgetPassword);
router.route("/resetPassword/:token").post(authController.resetPassword);
router
  .route("/isAuthenticated")
  .get(authController.protect, authController.isLoggedIn);
router.route("/logout").get(authController.protect, authController.logout);

module.exports = router;
