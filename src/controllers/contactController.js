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

const removeRequestContact = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removeContact = await contactService.removeRequestContact(
      currentUserId,
      contactId
    );
    return res.status(200).send({ success: !!removeContact });
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  findUsersContact: findUsersContact,
  addNew: addNew,
  removeRequestContact: removeRequestContact,
};
