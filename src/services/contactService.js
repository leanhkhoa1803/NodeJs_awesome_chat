const UserModel = require("../models/usersModel");
const contactModel = require("../models/contactModel");
const lodash = require("lodash");

const findUsersContact = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    let deprecatedUserId = [currentUserId];

    let contactsByUser = await contactModel.findAllByUsers(currentUserId);
    contactsByUser.forEach((contact) => {
      deprecatedUserId.push(contact.userId);
      deprecatedUserId.push(contact.contactId);
    });

    deprecatedUserId = lodash.uniqBy(deprecatedUserId);
    let users = await UserModel.findAllUserForAddContact(
      deprecatedUserId,
      keyword
    );
    resolve(users);
  });
};

const addNew = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let contactExists = await contactModel.checkExists(
      currentUserId,
      contactId
    );
    if (contactExists) {
      reject(false);
    }

    let contactItem = {
      userId: currentUserId,
      contactId: contactId,
    };
    let newContact = await contactModel.createNew(contactItem);
    resolve(newContact);
  });
};

const removeRequestContact = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeRequestContact = await contactModel.removeRequestContact(
      currentUserId,
      contactId
    );
    //kiem tra nguoi dung co xoa 2 lan ko result = {n:1,ok:1}
    if (removeRequestContact.n === 0) {
      reject(false);
    }
    resolve(true);
  });
};
module.exports = {
  findUsersContact: findUsersContact,
  addNew: addNew,
  removeRequestContact: removeRequestContact,
};
