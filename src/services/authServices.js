const usersModel = require("../models/usersModel");
const { transValidation, transSuccess, transMail } = require("../../lang/vi");
const uuidv4 = require("uuid");
const bcrypt = require("bcrypt");
const sendMail = require("../config/mailer");
const saltRound = 7;

const register = (email, gender, password, protocol, host) => {
  return new Promise(async (resolve, reject) => {
    //check email
    const userEmail = await usersModel.findByEmail(email);
    if (userEmail) {
      if (userEmail.deletedAt != null) {
        return reject(transValidation.email_remove);
      }
      if (!userEmail.local.isActive) {
        return reject(transValidation.email_not_active);
      }
      return reject(transValidation.email_duplicate);
    }
    //khoi tao user
    const salt = bcrypt.genSaltSync(saltRound);
    const userItem = {
      username: email.split("@")[0],
      gender: gender,
      local: {
        email: email,
        password: bcrypt.hashSync(password, salt),
        verifyToken: uuidv4.v4(),
      },
    };
    //save data
    const user = await usersModel.createNew(userItem);
    //gui mail
    const linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`;
    sendMail(email, transMail.subject, transMail.templates(linkVerify))
      .then((success) => {
        resolve(transSuccess.useCreatedSuccess);
      })
      .catch(async (error) => {
        //remove user
        await usersModel.removeById(user._id);
        reject(transMail.sendMailFailed);
      });
  });
};

const verifyAccount = (token) => {
  return new Promise(async (resolve, reject) => {
    const checkToken = await usersModel.findByToken(token);
    if (!checkToken) {
      return reject(transMail.token_isActived);
    }
    await usersModel.verify(token);
    resolve(transSuccess.account_isActived);
  });
};

module.exports = {
  register: register,
  verifyAccount: verifyAccount,
};
