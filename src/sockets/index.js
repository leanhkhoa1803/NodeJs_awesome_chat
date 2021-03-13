const addNewContact = require("./contact/addNewContact");
const removeRequestContactSent = require("./contact/removeRequestContactSent");
const removeRequestContactReceived = require("./contact/removeRequestContactReceived");
const acceptRequestContactReceived = require("./contact/acceptRequestContactReceived");
const removeContact = require("./contact/removeContact");

let initSockets = (io) => {
  addNewContact(io);
  removeContact(io);
  removeRequestContactSent(io);
  removeRequestContactReceived(io);
  acceptRequestContactReceived(io);
};

module.exports = initSockets;
