const { validationResult } = require("express-validator");
const messageService = require("../services/messageService");
const addNewTextEmoji = async (req, res) => {
  //check input
  let errorArray = [];
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = Object.values(validationErrors.mapped());
    errors.forEach((item) => {
      errorArray.push(item.msg);
    });
    return res.status(500).send(errorArray);
  }
  try {
    let sender = {
      id: req.user._id,
      username: req.user.username,
      avatar: req.user.avatar,
    };

    let receiverId = req.body.uid;
    let messageValue = req.body.messageValue;
    let isChatGroup = req.body.isChatGroup;

    let newMessage = await messageService.addNewTextEmoji(
      sender,
      receiverId,
      messageValue,
      isChatGroup
    );
    return res.status(200).send({ message: newMessage });
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  addNewTextEmoji: addNewTextEmoji,
};
