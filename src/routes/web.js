const express = require("express");
const authController = require("./../controllers/authController");
const homeController = require("./../controllers/homeController");
const userController = require("./../controllers/userController");
const contactController = require("./../controllers/contactController");
const notifycationController = require("./../controllers/notifycationController");
const messageController = require("./../controllers/messageController");
const authValidation = require("./../validation/authValidation");
const userValidation = require("./../validation/userValidation");
const contactValidation = require("./../validation/contactValidation");
const messageValidation = require("./../validation/messageValidation");
const passport = require("passport");
const initPassportLocal = require("../controllers/passportController/local");
const initPassportFacebook = require("../controllers/passportController/facebook");
const initPassportGoogle = require("../controllers/passportController/google");
const { transValidation } = require("../../lang/vi");

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
  router.get(
    "/contact/find-users/:keyword",
    authController.checkLogin,
    contactValidation.findUserContact,
    contactController.findUsersContact
  );
  router.post(
    "/contact/add-new",
    authController.checkLogin,
    contactController.addNew
  );
  router.delete(
    "/contact/remove-contact",
    authController.checkLogin,
    contactController.removeContact
  );
  router.delete(
    "/contact/remove-request-contact-sent",
    authController.checkLogin,
    contactController.removeRequestContactSent
  );
  router.delete(
    "/contact/remove-request-contact-received",
    authController.checkLogin,
    contactController.removeRequestContactReceived
  );
  router.put(
    "/contact/accept-request-contact-received",
    authController.checkLogin,
    contactController.acceptRequestContactReceived
  );
  router.get(
    "/contact/read-more-contacts",
    authController.checkLogin,
    contactController.readMoreContacts
  );
  router.get(
    "/contact/read-more-contacts-sent",
    authController.checkLogin,
    contactController.readMoreContactsSent
  );
  router.get(
    "/contact/read-more-contacts-received",
    authController.checkLogin,
    contactController.readMoreContactsReceived
  );
  router.get(
    "/notifycation/read-more",
    authController.checkLogin,
    notifycationController.readMore
  );
  router.put(
    "/notification/mark-all-as-read",
    authController.checkLogin,
    notifycationController.markNotifyAsRead
  );
  router.post(
    "/message/add-new-text-emoji",
    authController.checkLogin,
    messageValidation.checkMessageLength,
    messageController.addNewTextEmoji
  );
  router.post(
    "/message/add-new-image",
    authController.checkLogin,
    messageController.addNewImage
  );
  router.post(
    "/message/add-new-attachment",
    authController.checkLogin,
    messageController.addNewAttachment
  );
  return app.use("/", router);
};
module.exports = initRoutes;
