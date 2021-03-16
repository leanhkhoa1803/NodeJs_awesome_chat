const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ContactSchema = new Schema({
  userId: String,
  contactId: String,
  status: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null },
});

ContactSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  //tim tat ca user co moi quan he voi user duoc tim kiem
  findAllByUsers(userId) {
    return this.find({
      $or: [{ userId: userId }, { contactId: userId }],
    }).exec();
  },

  //kiem tra moi quan he
  checkExists(userId, contactId) {
    return this.findOne({
      $or: [
        { $and: [{ userId: userId }, { contactId: contactId }] },
        { $and: [{ userId: contactId }, { contactId: userId }] },
      ],
    }).exec();
  },

  //xoa ban be o tab danh ba
  removeContact(userId, contactId) {
    return this.deleteOne({
      $or: [
        {
          $and: [
            { userId: userId },
            { contactId: contactId },
            { status: true },
          ],
        },
        {
          $and: [
            { userId: contactId },
            { contactId: userId },
            { status: true },
          ],
        },
      ],
    }).exec();
  },
  //xoa bang ghi
  removeRequestContactSent(userId, contactId) {
    return this.deleteOne({
      $and: [{ userId: userId }, { contactId: contactId }, { status: false }],
    }).exec();
  },

  removeRequestContactReceived(userId, contactId) {
    return this.deleteOne({
      $and: [{ userId: contactId }, { contactId: userId }, { status: false }],
    }).exec();
  },

  //accept contact received
  acceptRequestContactReceived(userId, contactId) {
    return this.findOneAndUpdate(
      {
        $and: [{ userId: contactId }, { contactId: userId }, { status: false }],
      },
      { status: true },
      { updatedAt: Date.now() }
    ).exec();
  },

  //getContacts
  getContacts(userId, limit) {
    return this.find({
      $and: [
        { $or: [{ userId: userId }, { contactId: userId }] },
        { status: true },
      ],
    })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .exec();
  },

  //getContactsSent
  getContactsSent(userId, limit) {
    return this.find({ $and: [{ userId: userId }, { status: false }] })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },

  //getContactsReceived
  getContactsReceived(userId, limit) {
    return this.find({ $and: [{ contactId: userId }, { status: false }] })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },

  //countAllContacts
  countAllContacts(userId) {
    return this.countDocuments({
      $and: [
        { $or: [{ userId: userId }, { contactId: userId }] },
        { status: true },
      ],
    }).exec();
  },

  //countAllContactsSent
  countAllContactsSent(userId) {
    return this.countDocuments({
      $and: [{ userId: userId }, { status: false }],
    }).exec();
  },

  //countAllContactsReceived
  countAllContactsReceived(userId) {
    return this.countDocuments({
      $and: [{ contactId: userId }, { status: false }],
    }).exec();
  },

  readMoreContacts(userId, skip, limit) {
    return this.find({
      $and: [
        { $or: [{ userId: userId }, { contactId: userId }] },
        { status: true },
      ],
    })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();
  },

  readMoreContactsSent(userId, skip, limit) {
    return this.find({ $and: [{ userId: userId }, { status: false }] })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },

  readMoreContactsReceived(userId, skip, limit) {
    return this.find({ $and: [{ contactId: userId }, { status: false }] })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },

  updateWhenNewMessage(userId, contactId) {
    return this.findOneAndUpdate(
      {
        $or: [
          { $and: [{ userId: userId }, { contactId: contactId }] },
          { $and: [{ userId: contactId }, { contactId: userId }] },
        ],
      },
      { updatedAt: Date.now() }
    ).exec();
  },
};
module.exports = mongoose.model("contact", ContactSchema);
