const { check } = require("express-validator");
const { transValidation, transErrors } = require("../../lang/vi");

const updateInfo = [
  check("username", transValidation.update_usernames)
    .optional()
    .isLength({ min: 3, max: 17 })
    .matches(
      /^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
    ),

  check("gender", transValidation.update_gender)
    .optional()
    .isIn(["male", "female"]),

  check("address", transValidation.update_address)
    .optional()
    .isLength({ min: 3, max: 30 }),

  check("phone", transValidation.update_phone)
    .optional()
    .matches(/^(0)[0-9]{9,10}$/),
];

const updatePassword = [
  check("currentPassword", transValidation.password_incorrect)
    .optional()
    .isLength({ min: 3, max: 17 })
    .matches(
      /^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
    ),
  check("newPassword", transValidation.password_incorrect)
    .optional()
    .isLength({ min: 3, max: 17 })
    .matches(
      /^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
    )
    .custom((value, { req }) => value === req.body.confirmNewPassword),
  check("confirmNewPassword", transErrors.user_current_password).custom(
    (value, { req }) => value === req.body.newPassword
  ),
];
module.exports = {
  updateInfo: updateInfo,
  updatePassword: updatePassword,
};
