const multer = require("multer");
const { config } = require("../config/config");
const { transErrors, transSuccess } = require("../../lang/vi");
const uuid = require("uuid");
const userService = require("../services/userService");
const fsExtra = require("fs-extra");
const { validationResult } = require("express-validator");

const storageAvatar = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, config.avatar_directory);
  },
  filename: (req, file, callback) => {
    let math = config.avatar_type;
    if (math.indexOf(file.mimetype) === -1) {
      return callback(transErrors.avatar_type, null);
    }

    let avatarName = `${Date.now()}-${uuid.v4()}-${file.originalname}`;
    callback(null, avatarName);
  },
});

let avatarUploadFile = multer({
  storage: storageAvatar,
  limits: config.avatar_limit_size,
}).single("avatar");

const updateAvatar = (req, res) => {
  avatarUploadFile(req, res, async (err) => {
    if (err) {
      if (err.message) {
        return res.status(500).send(transErrors.avatar_size);
      }
      return res.status(500).send(err);
    } else {
      try {
        let updateUserItem = {
          avatar: req.file.filename,
          updatedAt: Date.now(),
        };

        //Update User
        let updateUser = await userService.updateUser(
          req.user._id,
          updateUserItem
        );
        //remove old user avatar
        await fsExtra.remove(`${config.avatar_directory}/${updateUser.avatar}`);

        let result = {
          message: transSuccess.userInfo_updated,
          imageSrc: `/images/users/${req.file.filename}`,
        };
        return res.status(200).send(result);
      } catch (error) {
        return res.status(500).send(error);
      }
    }
  });
};

const updateInfo = async (req, res) => {
  //check input
  let errorArray = [];
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = Object.values(validationErrors.mapped());
    errors.forEach((item) => {
      errorArray.push(item.msg);
    });
    console.log(errorArray);
    return res.status(500).send(errorArray);
  }

  try {
    const updateUserItem = req.body;
    //Update User
    let updateUser = await userService.updateUser(req.user._id, updateUserItem);
    let result = {
      message: transSuccess.userInfo_updated,
    };
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const updatePassword = async (req, res) => {
  try {
    let updatePassword = req.body;
    await userService.updatePassword(req.user._id, updatePassword);

    let result = {
      message: transSuccess.user_update_password,
    };
    return res.status(201).send(result);
  } catch (error) {
    return res.status(500).send(error);
  }
};
module.exports = {
  updateAvatar: updateAvatar,
  updateInfo: updateInfo,
  updatePassword: updatePassword,
};
