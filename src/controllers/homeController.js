const notifyCationService = require("../services/notifyServices");
const contactService = require("../services/contactService");
const messageService = require("../services/messageService");
const {
  bufferToBase64,
  getLastItemOfArray,
  covertTimeStamp,
} = require("../helpers/clientHelper");
const getHome = async (req, res) => {
  //only 10 items on time
  let arrNotifications = await notifyCationService.getNotifyCations(
    req.user._id
  );

  //get amouts notification unread
  let countNotifyUnread = await notifyCationService.countNotifyUnread(
    req.user._id
  );

  //get contacts (10 items one time)
  let contacts = await contactService.getContacts(req.user._id);

  //get contacts sent (10 items one time)
  let contactsSent = await contactService.getContactsSent(req.user._id);

  //get contacts received (10 items one time)
  let contactReceived = await contactService.getContactsReceived(req.user._id);

  //count all contacts
  let countAllContacts = await contactService.countAllContacts(req.user._id);
  let countAllContactsSent = await contactService.countAllContactsSent(
    req.user._id
  );
  let countAllContactsReceived = await contactService.countAllContactsReceived(
    req.user._id
  );

  let getAllConversationItems = await messageService.getAllConversationItems(
    req.user._id
  );

  let allConversationGetMessages =
    getAllConversationItems.allConversationGetMessages;
  return res.render("main/home/home", {
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.user,
    notifycations: arrNotifications,
    countNotifyUnread: countNotifyUnread,
    contacts: contacts,
    contactsSent: contactsSent,
    contactReceived: contactReceived,
    countAllContacts: countAllContacts,
    countAllContactsSent: countAllContactsSent,
    countAllContactsReceived: countAllContactsReceived,
    getAllConversationItems: getAllConversationItems,
    allConversationGetMessages: allConversationGetMessages,
    bufferToBase64: bufferToBase64,
    getLastItemOfArray: getLastItemOfArray,
    covertTimeStamp: covertTimeStamp,
  });
};

module.exports = {
  getHome: getHome,
};
