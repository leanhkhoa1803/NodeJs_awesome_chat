const passport = require("passport");
const passportLocal = require("passport-local");
const UserModel = require("../../models/usersModel");
const chat_groupModel = require("../../models/chat_groupModel");

const {
  transErrors,
  transValidation,
  transSuccess,
} = require("../../../lang/vi");
const localStrategy = passportLocal.Strategy;

//Valid user user account type: local

const initPassportLocal = () => {
  passport.use(
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const user = await UserModel.findByEmail(email);

          //kiem tra email co ton tai hay k
          if (!user) {
            return done(
              null,
              false,
              req.flash("errors", transErrors.login_failed)
            );
          }
          //kiem tra da kich hoat chua
          if (!user.local.isActive) {
            return done(
              null,
              false,
              req.flash("errors", transValidation.email_not_active)
            );
          }
          //kiem tra password
          const checkPassword = await user.comparePassword(password);
          if (!checkPassword) {
            return done(
              null,
              false,
              req.flash("errors", transErrors.login_failed)
            );
          }
          //neu dung email va password thi login success
          return done(
            null,
            user,
            req.flash("success", transSuccess.login_success(user.username))
          );
        } catch (error) {
          console.log(error);
          return done(
            null,
            false,
            req.flash("errors", transErrors.error_server)
          );
        }
      }
    )
  );

  //Save userId to session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  //call password.session();
  //return userInfo to req.user
  passport.deserializeUser(async (id, done) => {
    try {
      let user = await UserModel.findByUserIdToSession(id);
      let getChatGroupsId = await chat_groupModel.getChatGroupIdByUser(
        user._id
      );
      user = user.toObject();
      user.chatGroupId = getChatGroupsId;
      return done(null, user);
    } catch (error) {
      return done(err, null);
    }
  });
};

module.exports = initPassportLocal;
