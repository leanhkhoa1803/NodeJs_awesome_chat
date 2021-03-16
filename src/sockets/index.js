const addNewContact = require("./contact/addNewContact");
const removeRequestContactSent = require("./contact/removeRequestContactSent");
const removeRequestContactReceived = require("./contact/removeRequestContactReceived");
const acceptRequestContactReceived = require("./contact/acceptRequestContactReceived");
const removeContact = require("./contact/removeContact");
const chatTextEmoji = require("./chat/chatTextEmoji");
const typing_On = require("./chat/typing_On");
const typing_Off = require("./chat/typing_Off");

let initSockets = (io) => {
  addNewContact(io);
  removeContact(io);
  removeRequestContactSent(io);
  removeRequestContactReceived(io);
  acceptRequestContactReceived(io);
  chatTextEmoji(io);
  typing_On(io);
  typing_Off(io);
};

module.exports = initSockets;
