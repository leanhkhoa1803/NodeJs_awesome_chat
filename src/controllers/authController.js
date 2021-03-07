const { validationResult } = require("express-validator");
const authService = require("../services/authServices");
const UserModel = require("../models/usersModel");
const { Mongoose } = require("mongoose");
const { transSuccess } = require("../../lang/vi");
const getLoginRegister = (req, res) => {
  return res.render("auth/loginRegister", {
    errors: req.flash("errors"),
    success: req.flash("success"),
  });
};

const postRegister = async (req, res) => {
  //check input
  let errorArray = [];
  let successArray = [];
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errors = Object.values(validationErrors.mapped());
    errors.forEach((item) => {
      errorArray.push(item.msg);
    });
    req.flash("errors", errorArray);
    return res.redirect("/login-register");
  }
  const { email, gender, password } = req.body;
  const createUser = await authService
    .register(email, gender, password, req.protocol, req.get("host"))
    .then((success) => {
      successArray.push(success);
      req.flash("success", successArray);
      return res.redirect("/login-register");
    })
    .catch((error) => {
      errorArray.push(error);
      req.flash("errors", errorArray);
      return res.redirect("/login-register");
    });
};

//Active account
const verifyAccount = async (req, res) => {
  let errorArray = [];
  let successArray = [];
  try {
    const verifyStatus = await authService.verifyAccount(req.params.token);
    successArray.push(verifyStatus);
    req.flash("success", successArray);
    return res.redirect("/login-register");
  } catch (error) {
    errorArray.push(error);
    req.flash("errors", errorArray);
    return res.redirect("/login-register");
  }
};

const getLogout = (req, res) => {
  req.logout();
  req.flash("success", transSuccess.logout_success);
  return res.redirect("/login-register");
};

const checkLogin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login-register");
  }
  next();
};
const checkLogout = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
};
module.exports = {
  getLoginRegister: getLoginRegister,
  postRegister: postRegister,
  verifyAccount: verifyAccount,
  getLogout: getLogout,
  checkLogout: checkLogout,
  checkLogin: checkLogin,
};
