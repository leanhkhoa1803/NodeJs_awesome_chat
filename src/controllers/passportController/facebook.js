const passport = require("passport");
const passportFacebook = require("passport-facebook");
const UserModel = require("../../models/usersModel");
require("dotenv").config();
const {
  transErrors,
  transValidation,
  transSuccess,
} = require("../../../lang/vi");
const facebookStrategy = passportFacebook.Strategy;

//Valid user user account type: local

const initPassportFacebook = () => {
  passport.use(
    new facebookStrategy(
      {
        clientID: process.env.FB_APP_ID,
        clientSecret: process.env.FB_APP_SECRETKEY,
        callbackURL: process.env.FB_CALLBACK_URL,
        passReqToCallback: true,
        profileFields: ["email", "gender", "displayName"],
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const user = await UserModel.findByFacebookUid(profile.id);
          if (user) {
            return done(
              null,
              user,
              req.flash("success", transSuccess.login_success(user.username))
            );
          }
          const userItem = {
            username: profile.displayName,
            gender: profile.gender,
            local: {
              isActive: true,
            },
            facebook: {
              uid: profile.uid,
              token: accessToken,
              email: profile.emails[0].value,
            },
          };

          const newUser = await UserModel.createNew(userItem);
          return done(
            null,
            newUser,
            req.flash("success", transSuccess.login_success(newUser.username))
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
  passport.deserializeUser((id, done) => {
    UserModel.findByUserId(id)
      .then((user) => {
        return done(null, user);
      })
      .catch((err) => {
        return done(err, null);
      });
  });
};

module.exports = initPassportFacebook;
