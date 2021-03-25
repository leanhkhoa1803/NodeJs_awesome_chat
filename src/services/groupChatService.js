const lodash = require("lodash");
const chatGroupModel = require("../models/chat_groupModel");
const usersModel = require("../models/usersModel");

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
      let newGroup = await chatGroupModel.createNew(newGroupChatItem);

      newGroup = newGroup.toObject();
      newGroup.membersInfo = [];
      for (let member of newGroup.members) {
        let userInfo = await usersModel.getDataByUserId(member.userId);
        newGroup.membersInfo.push(userInfo);
      }
      resolve(newGroup);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  addNewGroup: addNewGroup,
};
