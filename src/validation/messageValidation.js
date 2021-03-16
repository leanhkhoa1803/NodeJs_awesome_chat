const { check } = require("express-validator");
const { transValidation } = require("../../lang/vi");

const checkMessageLength = [
  check("messagevalue", transValidation.message_Text_Emoji_Incorrect).isLength({
    max: 400,
  }),
];

module.exports = {
  checkMessageLength: checkMessageLength,
};
