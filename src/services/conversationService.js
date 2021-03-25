const ContactModel = require("../models/contactModel");
const UserModel = require("../models/usersModel");
const ChatGroupModel = require("../models/chat_groupModel");
const lodash = require("lodash");
const LIMIT_CONVERSATIONS_TAKEN = 15;

let searchConversation = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContacts(
        currentUserId,
        LIMIT_CONVERSATIONS_TAKEN
      );
      let usersContactPromise = contacts.map(async (contact) => {
        if (contact.contactId == currentUserId) {
          let getUserContact = await UserModel.getNormalUserDataByIdAndKeyword(
            contact.userId,
            keyword
          );

          if (getUserContact.length) {
            getUserContact.updatedAt = contact.updatedAt;
            return getUserContact[0]; // get by id & keyword => just one item
          }
        } else {
          let getUserContact = await UserModel.getNormalUserDataByIdAndKeyword(
            contact.contactId,
            keyword
          );

          if (getUserContact.length) {
            getUserContact.updatedAt = contact.updatedAt;
            return getUserContact[0]; // get by id & keyword => just one item
          }
        }
      });

      let userConversations = await Promise.all(usersContactPromise);
      userConversations = lodash.filter(
        userConversations,
        (user) => typeof user !== "undefined"
      );

      let groupConversations = await ChatGroupModel.getChatGroupsByUserIdAndKeyword(
        currentUserId,
        keyword,
        LIMIT_CONVERSATIONS_TAKEN
      );

      // merge two array: userConversations & groupConversations
      let allConversations = userConversations.concat(groupConversations);
      // console.log(allConversations);

      // sort by updatedAt desending
      allConversations = lodash.sortBy(allConversations, (item) => {
        return -item.updatedAt;
      });

      resolve(allConversations);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  searchConversation: searchConversation,
};
