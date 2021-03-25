const { validationResult } = require("express-validator");
const conversationService = require("../services/conversationService");

let searchConversation = async (req, res) => {
  let errorsArr = [];
  let validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach((item) => {
      errorsArr.push(item.msg);
    });

    return res.status(500).send(errorsArr);
  }

  try {
    let currentUserId = req.user._id;
    let keyword = req.params.keyword;

    let allConversations = await conversationService.searchConversation(
      currentUserId,
      keyword
    );
    return res.render("main/conversation/_searchConversation", {
      allConversations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

module.exports = {
  searchConversation: searchConversation,
};
