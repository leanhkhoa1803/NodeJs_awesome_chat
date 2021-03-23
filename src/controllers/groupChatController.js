const { validationResult } = require("express-validator");
const groupChatService = require("../services/groupChatService");
const addNewGroup = async (req, res) => {
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
    let currentUserId = req.user._id;
    let arrayMembers = req.body.arrayIds;
    let groupChatName = req.body.groupChatname;
    let newGroupChat = await groupChatService.addNewGroup(
      currentUserId,
      arrayMembers,
      groupChatName
    );

    return res.status(200).send({ groupChat: newGroupChat });
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  addNewGroup: addNewGroup,
};
