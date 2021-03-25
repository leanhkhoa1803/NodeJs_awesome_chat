const { validationResult } = require("express-validator");
const groupChatService = require("../services/groupChatService");
const { promisify } = require("util");
const ejs = require("ejs");

// Make renderFile available with async await
const renderFile = promisify(ejs.renderFile).bind(ejs);
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
    let membersModalData = await renderFile(
      "src/views/main/extras/_newMembersModal.ejs",
      {
        newGroupChat: newGroupChat,
        user: req.user,
      }
    );
    return res.status(200).send({
      groupChat: newGroupChat,
      membersModalData: membersModalData, //extras
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

module.exports = {
  addNewGroup: addNewGroup,
};
