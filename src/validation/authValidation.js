const { check } = require("express-validator");
const { transValidation } = require("../../lang/vi");

const register = [
  check("email", transValidation.email_incorrect).isEmail().trim(),
  check("gender", transValidation.gender_incorrect).isIn(["male", "female"]),
  check("password", transValidation.password_incorrect)
    .isLength({ min: 6 })
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,}$/
    ),
  check(
    "password_confirmation",
    transValidation.password_confirm_incorrect
  ).custom((value, { req }) => {
    return value === req.body.password;
  }),
];

module.exports = {
  register: register,
};
