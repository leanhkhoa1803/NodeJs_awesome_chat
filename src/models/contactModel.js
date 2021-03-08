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

  //xoa bang ghi
  removeRequestContact(userId, contactId) {
    return this.deleteOne({
      $and: [{ userId: userId }, { contactId: contactId }],
    }).exec();
  },
};
module.exports = mongoose.model("contact", ContactSchema);
