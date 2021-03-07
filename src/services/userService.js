const UserModel = require("../models/usersModel");
const { transErrors } = require("../../lang/vi");
const bcrypt = require("bcrypt");
let saltRound = 7;

const updateUser = (id, item) => {
  return UserModel.updateUser(id, item);
};

const updatePassword = (id, item) => {
  return new Promise(async (resolve, reject) => {
    let currentUser = await UserModel.findByUserId(id);
    if (!currentUser) {
      return reject(transErrors.account_undefined);
    }

    let checkCurrentPassword = await currentUser.comparePassword(
      item.currentPassword
    );

    if (!checkCurrentPassword) {
      return reject(transErrors.user_current_password);
    }

    if (item.newPassword !== item.confirmNewPassword) {
      return reject(transErrors.user_current_password);
    }

    let salt = bcrypt.genSaltSync(saltRound);
    await UserModel.updatePassword(id, bcrypt.hashSync(item.newPassword, salt));
    resolve(true);
  });
};
module.exports = {
  updateUser: updateUser,
  updatePassword: updatePassword,
};
