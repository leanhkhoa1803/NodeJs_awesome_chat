const contactModel = require("../models/contactModel");
const chatGroupModel = require("../models/chat_groupModel");
const lodash = require("lodash");
const usersModel = require("../models/usersModel");

const LIMIT_CONVERSATION = 5;

const getAllConversationItems = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await contactModel.getContacts(
        currentUserId,
        LIMIT_CONVERSATION
      );
      let userConversationsPromise = contacts.map(async (contact) => {
        if (contact.contactId == currentUserId) {
          let getUserContact = await usersModel.getDataByUserId(contact.userId);
          getUserContact.createdAt = contact.createdAt;
          return getUserContact;
        } else {
          let getUserContact = await UserModel.getDataByUserId(
            contact.contactId
          );
          getUserContact.createdAt = contact.createdAt;
          return getUserContact;
        }
      });

      let userConversations = await Promise.all(userConversationsPromise);

      let groupConversations = await chatGroupModel.getChatGroups(
        currentUserId,
        LIMIT_CONVERSATION
      );

      let AllConversation = userConversations.concat(groupConversations);
      AllConversation = lodash.sortBy(AllConversation, (item) => {
        return -item.createdAt;
      });

      resolve({
        userConversations: userConversations,
        groupConversations: groupConversations,
        AllConversation: AllConversation,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllConversationItems: getAllConversationItems,
};
