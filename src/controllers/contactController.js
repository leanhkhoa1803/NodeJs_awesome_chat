const contactService = require("../services/contactService");
const { validationResult } = require("express-validator");
const contactModel = require("../models/contactModel");

const findUsersContact = async (req, res) => {
  let errorArray = [];
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = Object.values(validationErrors.mapped());
    errors.forEach((item) => {
      errorArray.push(item.msg);
    });
    return res.status(500).send(errorArray);
  }
  try {
    let currentUserId = req.user._id;
    let keyword = req.params.keyword;

    const users = await contactService.findUsersContact(currentUserId, keyword);

    return res.render("main/contact/sections/_findUserContact", { users });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const addNew = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let newContact = await contactService.addNew(currentUserId, contactId);
    return res.status(200).send({ success: !!newContact });
  } catch (error) {
    return res.status(500).send(error);
  }
};
const removeContact = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removeContact = await contactService.removeContact(
      currentUserId,
      contactId
    );
    return res.status(200).send({ success: !!removeContact });
  } catch (error) {
    return res.status(500).send(error);
  }
};
const removeRequestContactSent = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removeContact = await contactService.removeRequestContactSent(
      currentUserId,
      contactId
    );
    return res.status(200).send({ success: !!removeContact });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const removeRequestContactReceived = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removeContact = await contactService.removeRequestContactReceived(
      currentUserId,
      contactId
    );
    return res.status(200).send({ success: !!removeContact });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const acceptRequestContactReceived = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let acceptContact = await contactService.acceptRequestContactReceived(
      currentUserId,
      contactId
    );
    return res.status(200).send({ success: !!acceptContact });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const readMoreContacts = async (req, res) => {
  try {
    let skipNumberContact = +req.query.skipNumber;
    let newContactsUsers = await contactService.readMoreContacts(
      req.user._id,
      skipNumberContact
    );

    return res.status(200).send(newContactsUsers);
  } catch (error) {
    return res.status(200).send({ error });
  }
};

const readMoreContactsSent = async (req, res) => {
  try {
    let skipNumberContact = +req.query.skipNumber;
    let newContactsUsers = await contactService.readMoreContactsSent(
      req.user._id,
      skipNumberContact
    );

    return res.status(200).send(newContactsUsers);
  } catch (error) {
    return res.status(200).send({ error });
  }
};

const readMoreContactsReceived = async (req, res) => {
  try {
    let skipNumberContact = +req.query.skipNumber;
    let newContactsUsers = await contactService.readMoreContactsReceived(
      req.user._id,
      skipNumberContact
    );

    return res.status(200).send(newContactsUsers);
  } catch (error) {
    return res.status(200).send({ error });
  }
};
module.exports = {
  findUsersContact: findUsersContact,
  addNew: addNew,
  removeContact: removeContact,
  removeRequestContactSent: removeRequestContactSent,
  removeRequestContactReceived: removeRequestContactReceived,
  readMoreContacts: readMoreContacts,
  readMoreContactsSent: readMoreContactsSent,
  readMoreContactsReceived: readMoreContactsReceived,
  acceptRequestContactReceived: acceptRequestContactReceived,
};
