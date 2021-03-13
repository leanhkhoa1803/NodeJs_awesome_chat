const UserModel = require("../models/usersModel");
const contactModel = require("../models/contactModel");
const notifyCationModel = require("../models/notificationsModel");
const lodash = require("lodash");

const LIMIT_NOTIFICATIONS = 2;
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
    //create contact
    let newContact = await contactModel.createNew(contactItem);

    //create notification
    let notifyCationItem = {
      senderId: currentUserId,
      receiverId: contactId,
      type: notifyCationModel.types.ADD_CONTACT,
    };

    await notifyCationModel.model.createNew(notifyCationItem);

    resolve(newContact);
  });
};

const removeContact = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeContact = await contactModel.removeContact(
      currentUserId,
      contactId
    );
    //kiem tra nguoi dung co xoa 2 lan ko result = {n:1,ok:1}
    if (removeContact.n === 0) {
      reject(false);
    }
    resolve(true);
  });
};

const removeRequestContactSent = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeRequestContactSent = await contactModel.removeRequestContactSent(
      currentUserId,
      contactId
    );
    //kiem tra nguoi dung co xoa 2 lan ko result = {n:1,ok:1}
    if (removeRequestContactSent.n === 0) {
      reject(false);
    }

    //remove notification
    await notifyCationModel.model.removeRequestContactNotification(
      currentUserId,
      contactId,
      notifyCationModel.types.ADD_CONTACT
    );
    resolve(true);
  });
};

const removeRequestContactReceived = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeRequestContactReceived = await contactModel.removeRequestContactReceived(
      currentUserId,
      contactId
    );
    //kiem tra nguoi dung co xoa 2 lan ko result = {n:1,ok:1}
    if (removeRequestContactReceived.n === 0) {
      reject(false);
    }

    //remove notification
    // await notifyCationModel.model.removeRequestContactReceivedNotification(
    //   currentUserId,
    //   contactId,
    //   notifyCationModel.types.ADD_CONTACT
    // );
    resolve(true);
  });
};

const acceptRequestContactReceived = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let acceptRequestContactReceived = await contactModel.acceptRequestContactReceived(
      currentUserId,
      contactId
    );
    //kiem tra nguoi dung co xoa 2 lan ko result = {n:1,ok:1}
    if (acceptRequestContactReceived.nModified === 0) {
      reject(false);
    }

    //create notification
    let notifyCationItem = {
      senderId: currentUserId,
      receiverId: contactId,
      type: notifyCationModel.types.ACCEPT_CONTACT,
    };

    await notifyCationModel.model.createNew(notifyCationItem);
    resolve(true);
  });
};

const getContacts = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await contactModel.getContacts(
        currentUserId,
        LIMIT_NOTIFICATIONS
      );
      let users = contacts.map(async (contact) => {
        if (contact.contactId == currentUserId) {
          return await UserModel.getDataByUserId(contact.userId);
        } else {
          return await UserModel.getDataByUserId(contact.contactId);
        }
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

const getContactsSent = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await contactModel.getContactsSent(
        currentUserId,
        LIMIT_NOTIFICATIONS
      );
      let users = contacts.map(async (contact) => {
        return await UserModel.getDataByUserId(contact.contactId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

const getContactsReceived = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await contactModel.getContactsReceived(
        currentUserId,
        LIMIT_NOTIFICATIONS
      );
      let users = contacts.map(async (contact) => {
        return await UserModel.getDataByUserId(contact.userId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

const countAllContacts = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await contactModel.countAllContacts(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

const countAllContactsSent = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await contactModel.countAllContactsSent(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

const countAllContactsReceived = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await contactModel.countAllContactsReceived(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

const readMoreContacts = (currentUserId, skipNumberContact) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newContacts = await contactModel.readMoreContacts(
        currentUserId,
        skipNumberContact,
        LIMIT_NOTIFICATIONS
      );

      let users = newContacts.map(async (contact) => {
        if (contact.contactId == currentUserId) {
          return await UserModel.getDataByUserId(contact.userId);
        } else {
          return await UserModel.getDataByUserId(contact.contactId);
        }
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

const readMoreContactsSent = (currentUserId, skipNumberContact) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newContacts = await contactModel.readMoreContactsSent(
        currentUserId,
        skipNumberContact,
        LIMIT_NOTIFICATIONS
      );

      let users = newContacts.map(async (contact) => {
        return await UserModel.getDataByUserId(contact.contactId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

const readMoreContactsReceived = (currentUserId, skipNumberContact) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newContacts = await contactModel.readMoreContactsReceived(
        currentUserId,
        skipNumberContact,
        LIMIT_NOTIFICATIONS
      );

      let users = newContacts.map(async (contact) => {
        return await UserModel.getDataByUserId(contact.userId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  findUsersContact: findUsersContact,
  addNew: addNew,
  removeContact: removeContact,
  removeRequestContactSent: removeRequestContactSent,
  removeRequestContactReceived: removeRequestContactReceived,
  acceptRequestContactReceived: acceptRequestContactReceived,
  getContacts: getContacts,
  getContactsSent: getContactsSent,
  getContactsReceived: getContactsReceived,
  countAllContacts: countAllContacts,
  countAllContactsSent: countAllContactsSent,
  countAllContactsReceived: countAllContactsReceived,
  readMoreContacts: readMoreContacts,
  readMoreContactsSent: readMoreContactsSent,
  readMoreContactsReceived: readMoreContactsReceived,
};
