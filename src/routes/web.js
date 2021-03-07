const express = require("express");
const authController = require("./../controllers/authController");
const homeController = require("./../controllers/homeController");
const userController = require("./../controllers/userController");
const authValidation = require("./../validation/authValidation");
const userValidation = require("./../validation/userValidation");
const passport = require("passport");
const initPassportLocal = require("../controllers/passportController/local");
const initPassportFacebook = require("../controllers/passportController/facebook");
const initPassportGoogle = require("../controllers/passportController/google");

//init all passport
initPassportLocal();
initPassportFacebook();
initPassportGoogle();

const router = express.Router();

//Init all routes
const initRoutes = (app) => {
  router.get("/", authController.checkLogin, homeController.getHome);
  router.get(
    "/login-register",
    authController.checkLogout,
    authController.getLoginRegister
  );
  router.post(
    "/register",
    authController.checkLogout,
    authValidation.register,
    authController.postRegister
  );
  router.get(
    "/verify/:token",
    authController.checkLogout,
    authController.verifyAccount
  );
  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login-register",
      successFlash: true,
      failureFlash: true,
    })
  );

  router.get(
    "/auth/facebook",
    authController.checkLogout,
    passport.authenticate("facebook", { scope: ["email"] })
  );
  router.get(
    "/auth/facebook/callback",
    authController.checkLogout,
    passport.authenticate("facebook", {
      successRedirect: "/",
      failureRedirect: "/login-register",
    })
  );

  router.get(
    "/auth/google",
    authController.checkLogout,
    passport.authenticate("google", { scope: ["email"] })
  );
  router.get(
    "/auth/google/callback",
    authController.checkLogout,
    passport.authenticate("google", {
      successRedirect: "/",
      failureRedirect: "/login-register",
    })
  );

  router.get("/logout", authController.checkLogin, authController.getLogout);
  router.put(
    "/user/update-avatar",
    authController.checkLogin,
    userController.updateAvatar
  );
  router.put(
    "/user/update-info",
    authController.checkLogin,
    userValidation.updateInfo,
    userController.updateInfo
  );
  router.put(
    "/user/update-password",
    authController.checkLogin,
    userValidation.updatePassword,
    userController.updatePassword
  );

  return app.use("/", router);
};
module.exports = initRoutes;
