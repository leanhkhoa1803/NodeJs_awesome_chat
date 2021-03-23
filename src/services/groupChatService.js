const lodash = require("lodash");
const chatGroupModel = require("../models/chat_groupModel");

const addNewGroup = (currentUserId, arrayMembers, groupChatName) => {
  return new Promise(async (resolve, reject) => {
    try {
      //add currentUserId to arrayMembers
      arrayMembers.unshift({ userId: `${currentUserId}` });
      arrayMembers = lodash.uniqBy(arrayMembers, "userId");

      let newGroupChatItem = {
        name: groupChatName,
        userAmount: arrayMembers.length,
        userId: `${currentUserId}`,
        members: arrayMembers,
      };
      let newGroupChat = await chatGroupModel.createNew(newGroupChatItem);
      resolve(newGroupChat);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  addNewGroup: addNewGroup,
};
