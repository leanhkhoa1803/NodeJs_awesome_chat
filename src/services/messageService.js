const contactModel = require("../models/contactModel");
const chatGroupModel = require("../models/chat_groupModel");
const messageModel = require("../models/messageModel");
const lodash = require("lodash");
const usersModel = require("../models/usersModel");
const { transErrors } = require("../../lang/vi");
const { config } = require("../config/config");
const fsExtra = require("fs-extra");

const LIMIT_CONVERSATION = 5;
const LIMIT_MESSAGE_TAKEN = 10;
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
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        } else {
          let getUserContact = await usersModel.getDataByUserId(
            contact.contactId
          );
          getUserContact.updatedAt = contact.updatedAt;
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
        return -item.updatedAt;
      });

      //get messages to screen chat
      let allConversationGetMessagesPromise = AllConversation.map(
        async (conversation) => {
          conversation = conversation.toObject();
          if (conversation.members) {
            let getMessages = await messageModel.model.getMessagesInGroup(
              conversation._id,
              LIMIT_MESSAGE_TAKEN
            );
            conversation.messages = lodash.reverse(getMessages);
          } else {
            let getMessages = await messageModel.model.getMessagesInPersonal(
              currentUserId,
              conversation._id,
              LIMIT_MESSAGE_TAKEN
            );
            conversation.messages = lodash.reverse(getMessages);
          }

          return conversation;
        }
      );

      let allConversationGetMessages = await Promise.all(
        allConversationGetMessagesPromise
      );
      //sort data
      allConversationGetMessages = lodash.sortBy(
        allConversationGetMessages,
        (item) => {
          return -item.updatedAt;
        }
      );
      resolve({
        allConversationGetMessages: allConversationGetMessages,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const addNewTextEmoji = (sender, receiverId, messageValue, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (isChatGroup) {
        //check message in group
        let chatGroupReceiver = await chatGroupModel.getChatGroupById(
          receiverId
        );
        if (!chatGroupReceiver) {
          return reject(transErrors.conversation_is_not_found);
        }
        let receiver = {
          id: chatGroupReceiver._id,
          username: chatGroupReceiver.username,
          avatar: config.avatar_group_chat,
        };
        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: messageModel.conversationTypes.GROUP,
          messageType: messageModel.messageTypes.TEXT,
          sender: sender,
          receiver: receiver,
          text: messageValue,
          createdAt: Date.now(),
        };
        //create new message
        let newMessage = await messageModel.model.createNew(newMessageItem);
        //update group chat message
        await chatGroupModel.updateWhenNewMessageDelivered(
          chatGroupReceiver._id,
          chatGroupReceiver.messageAmount + 1
        );
        resolve(newMessage);
      } else {
        let userGroupReceiver = await usersModel.getDataByUserId(receiverId);

        if (!userGroupReceiver) {
          return reject(transErrors.conversation_is_not_found);
        }
        let receiver = {
          id: userGroupReceiver._id,
          username: userGroupReceiver.username,
          avatar: userGroupReceiver.avatar,
        };
        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: messageModel.conversationTypes.PERSONAL,
          messageType: messageModel.messageTypes.TEXT,
          sender: sender,
          receiver: receiver,
          text: messageValue,
          createdAt: Date.now(),
        };
        //create new message
        let newMessage = await messageModel.model.createNew(newMessageItem);
        //update contact
        await contactModel.updateWhenNewMessage(
          sender.id,
          userGroupReceiver.id
        );
        resolve(newMessage);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const addNewImage = (sender, receiverId, messageValue, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (isChatGroup) {
        //check message in group
        let chatGroupReceiver = await chatGroupModel.getChatGroupById(
          receiverId
        );
        if (!chatGroupReceiver) {
          return reject(transErrors.conversation_is_not_found);
        }
        let receiver = {
          id: chatGroupReceiver._id,
          username: chatGroupReceiver.username,
          avatar: config.avatar_group_chat,
        };

        let imageBuffer = await fsExtra.readFile(messageValue.path);
        let imageContentType = messageValue.mimeType;
        let imageName = messageValue.originalname;

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: messageModel.conversationTypes.GROUP,
          messageType: messageModel.messageTypes.IMAGE,
          sender: sender,
          receiver: receiver,
          file: {
            data: imageBuffer,
            contentType: imageContentType,
            fileName: imageName,
          },
          createdAt: Date.now(),
        };
        //create new message
        let newMessage = await messageModel.model.createNew(newMessageItem);
        //update group chat message
        await chatGroupModel.updateWhenNewMessageDelivered(
          chatGroupReceiver._id,
          chatGroupReceiver.messageAmount + 1
        );
        resolve(newMessage);
      } else {
        let userGroupReceiver = await usersModel.getDataByUserId(receiverId);

        if (!userGroupReceiver) {
          return reject(transErrors.conversation_is_not_found);
        }
        let receiver = {
          id: userGroupReceiver._id,
          username: userGroupReceiver.username,
          avatar: userGroupReceiver.avatar,
        };
        let imageBuffer = await fsExtra.readFile(messageValue.path);
        let imageContentType = messageValue.mimeType;
        let imageName = messageValue.originalname;

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: messageModel.conversationTypes.PERSONAL,
          messageType: messageModel.messageTypes.IMAGE,
          sender: sender,
          receiver: receiver,
          file: {
            data: imageBuffer,
            contentType: imageContentType,
            fileName: imageName,
          },
          createdAt: Date.now(),
        };
        //create new message
        let newMessage = await messageModel.model.createNew(newMessageItem);
        //update contact
        await contactModel.updateWhenNewMessage(
          sender.id,
          userGroupReceiver.id
        );
        resolve(newMessage);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const addNewAttachment = (sender, receiverId, messageValue, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (isChatGroup) {
        //check message in group
        let chatGroupReceiver = await chatGroupModel.getChatGroupById(
          receiverId
        );
        if (!chatGroupReceiver) {
          return reject(transErrors.conversation_is_not_found);
        }
        let receiver = {
          id: chatGroupReceiver._id,
          username: chatGroupReceiver.username,
          avatar: config.avatar_group_chat,
        };

        let attachmentBuffer = await fsExtra.readFile(messageValue.path);
        let attachmentContentType = messageValue.mimeType;
        let attachmentName = messageValue.originalname;

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: messageModel.conversationTypes.GROUP,
          messageType: messageModel.messageTypes.FILE,
          sender: sender,
          receiver: receiver,
          file: {
            data: attachmentBuffer,
            contentType: attachmentContentType,
            fileName: attachmentName,
          },
          createdAt: Date.now(),
        };
        //create new message
        let newMessage = await messageModel.model.createNew(newMessageItem);
        //update group chat message
        await chatGroupModel.updateWhenNewMessageDelivered(
          chatGroupReceiver._id,
          chatGroupReceiver.messageAmount + 1
        );
        resolve(newMessage);
      } else {
        let userGroupReceiver = await usersModel.getDataByUserId(receiverId);

        if (!userGroupReceiver) {
          return reject(transErrors.conversation_is_not_found);
        }
        let receiver = {
          id: userGroupReceiver._id,
          username: userGroupReceiver.username,
          avatar: userGroupReceiver.avatar,
        };
        let attachmentBuffer = await fsExtra.readFile(messageValue.path);
        let attachmentContentType = messageValue.mimeType;
        let attachmentName = messageValue.originalname;

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: messageModel.conversationTypes.PERSONAL,
          messageType: messageModel.messageTypes.FILE,
          sender: sender,
          receiver: receiver,
          file: {
            data: attachmentBuffer,
            contentType: attachmentContentType,
            fileName: attachmentName,
          },
          createdAt: Date.now(),
        };
        //create new message
        let newMessage = await messageModel.model.createNew(newMessageItem);
        //update contact
        await contactModel.updateWhenNewMessage(
          sender.id,
          userGroupReceiver.id
        );
        resolve(newMessage);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const readMoreAllChat = (currentUserId, skipPersonal, skipGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await contactModel.readMoreContacts(
        currentUserId,
        skipPersonal,
        LIMIT_CONVERSATION
      );

      let userConversationsPromise = contacts.map(async (contact) => {
        if (contact.contactId == currentUserId) {
          let getUserContact = await usersModel.getDataByUserId(contact.userId);
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        } else {
          let getUserContact = await usersModel.getDataByUserId(
            contact.contactId
          );
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        }
      });

      let userConversations = await Promise.all(userConversationsPromise);

      let groupConversations = await chatGroupModel.readMoreChatGroups(
        currentUserId,
        skipGroup,
        LIMIT_CONVERSATION
      );

      let AllConversation = userConversations.concat(groupConversations);
      AllConversation = lodash.sortBy(AllConversation, (item) => {
        return -item.updatedAt;
      });

      //get messages to screen chat
      let allConversationGetMessagesPromise = AllConversation.map(
        async (conversation) => {
          conversation = conversation.toObject();
          if (conversation.members) {
            let getMessages = await messageModel.model.getMessagesInGroup(
              conversation._id,
              LIMIT_MESSAGE_TAKEN
            );
            conversation.messages = lodash.reverse(getMessages);
          } else {
            let getMessages = await messageModel.model.getMessagesInPersonal(
              currentUserId,
              conversation._id,
              LIMIT_MESSAGE_TAKEN
            );
            conversation.messages = lodash.reverse(getMessages);
          }

          return conversation;
        }
      );

      let allConversationGetMessages = await Promise.all(
        allConversationGetMessagesPromise
      );
      //sort data
      allConversationGetMessages = lodash.sortBy(
        allConversationGetMessages,
        (item) => {
          return -item.updatedAt;
        }
      );
      resolve(allConversationGetMessages);
    } catch (error) {
      reject(error);
    }
  });
};

const readMoreUserChat = (currentUserId, skipPersonal) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await contactModel.readMoreContacts(
        currentUserId,
        skipPersonal,
        LIMIT_CONVERSATION
      );

      let userConversationsPromise = contacts.map(async (contact) => {
        if (contact.contactId == currentUserId) {
          let getUserContact = await usersModel.getDataByUserId(contact.userId);
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        } else {
          let getUserContact = await usersModel.getDataByUserId(
            contact.contactId
          );
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        }
      });

      let userConversations = await Promise.all(userConversationsPromise);

      userConversations = lodash.sortBy(userConversations, (item) => {
        return -item.updatedAt;
      });

      //get messages to screen chat
      let allConversationGetMessagesPromise = userConversations.map(
        async (conversation) => {
          conversation = conversation.toObject();
          let getMessages = await messageModel.model.getMessagesInPersonal(
            currentUserId,
            conversation._id,
            LIMIT_MESSAGE_TAKEN
          );
          conversation.messages = lodash.reverse(getMessages);

          return conversation;
        }
      );

      let allConversationGetMessages = await Promise.all(
        allConversationGetMessagesPromise
      );
      //sort data
      allConversationGetMessages = lodash.sortBy(
        allConversationGetMessages,
        (item) => {
          return -item.updatedAt;
        }
      );
      resolve(allConversationGetMessages);
    } catch (error) {
      reject(error);
    }
  });
};

const readMoreGroupChat = (currentUserId, skipGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      let groupConversations = await chatGroupModel.readMoreChatGroups(
        currentUserId,
        skipGroup,
        LIMIT_CONVERSATION
      );

      AllConversation = lodash.sortBy(groupConversations, (item) => {
        return -item.updatedAt;
      });

      //get messages to screen chat
      let allConversationGetMessagesPromise = AllConversation.map(
        async (conversation) => {
          conversation = conversation.toObject();

          let getMessages = await messageModel.model.getMessagesInGroup(
            conversation._id,
            LIMIT_MESSAGE_TAKEN
          );
          conversation.messages = lodash.reverse(getMessages);

          return conversation;
        }
      );

      let allConversationGetMessages = await Promise.all(
        allConversationGetMessagesPromise
      );
      //sort data
      allConversationGetMessages = lodash.sortBy(
        allConversationGetMessages,
        (item) => {
          return -item.updatedAt;
        }
      );
      resolve(allConversationGetMessages);
    } catch (error) {
      reject(error);
    }
  });
};

const readMore = (currentUserId, skipMessage, targetId, chatInGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (chatInGroup) {
        let getMessages = await messageModel.model.readMoreMessageInGroup(
          targetId,
          skipMessage,
          LIMIT_MESSAGE_TAKEN
        );
        getMessages = lodash.reverse(getMessages);
        return resolve(getMessages);
      }
      let getMessages = await messageModel.model.readMoreMessageInPersonal(
        currentUserId,
        targetId,
        skipMessage,
        LIMIT_MESSAGE_TAKEN
      );
      getMessages = lodash.reverse(getMessages);
      return resolve(getMessages);
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  getAllConversationItems: getAllConversationItems,
  addNewTextEmoji: addNewTextEmoji,
  addNewImage: addNewImage,
  addNewAttachment: addNewAttachment,
  readMoreAllChat: readMoreAllChat,
  readMoreUserChat: readMoreUserChat,
  readMoreGroupChat: readMoreGroupChat,
  readMore: readMore,
};
