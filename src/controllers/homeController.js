const notifyCationService = require("../services/notifyServices");
const contactService = require("../services/contactService");
const messageService = require("../services/messageService");
const {
  bufferToBase64,
  getLastItemOfArray,
  covertTimeStamp,
} = require("../helpers/clientHelper");
const request = require("request");

let getICETurnServer = () => {
  return new Promise(async (resolve, reject) => {
    // // Node Get ICE STUN and TURN list
    // let o = {
    //   format: "urls",
    // };

    // let bodyString = JSON.stringify(o);
    // let options = {
    //   url: "https://global.xirsys.net/_turn/awesome-chat",
    //   // host: "global.xirsys.net",
    //   // path: "/_turn/awesome-chat",
    //   method: "PUT",
    //   headers: {
    //     Authorization:
    //       "Basic " +
    //       Buffer.from("anhkhoa:aae1c76e-88b3-11eb-b317-0242ac150002").toString(
    //         "base64"
    //       ),
    //     "Content-Type": "application/json",
    //     "Content-Length": bodyString.length,
    //   },
    // };

    // //call request to get ICE list of turn server
    // request(options, (error, response, body) => {
    //   if (error) {
    //     return reject(error);
    //   }
    //   let bodyJSON = JSON.parse(body);
    //   resolve(bodyJSON.v.iceServers);
    // });
    resolve([]);
  });
};

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

  let iceServerList = await getICETurnServer();
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
    allConversationGetMessages: allConversationGetMessages,
    bufferToBase64: bufferToBase64,
    getLastItemOfArray: getLastItemOfArray,
    covertTimeStamp: covertTimeStamp,
    iceServerList: JSON.stringify(iceServerList),
  });
};

module.exports = {
  getHome: getHome,
};
