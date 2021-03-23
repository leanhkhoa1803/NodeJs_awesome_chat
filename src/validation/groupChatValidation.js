const { check } = require("express-validator");
const { transValidation } = require("../../lang/vi");

const addNewGroupChat = [
  check("arrayIds", transValidation.add_new_group_user_incorrect).custom(
    (value) => {
      if (!Array.isArray(value)) {
        return false;
      }
      if (value.length < 2) {
        return false;
      }
      return true;
    }
  ),
  check("groupChatname", transValidation.add_new_group_name_incorrect).isLength(
    {
      min: 1,
    }
  ),
];

module.exports = {
  addNewGroupChat: addNewGroupChat,
};
