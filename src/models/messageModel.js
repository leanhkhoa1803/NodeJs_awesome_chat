const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  senderId: String,
  receiverId: String,
  conversationType: String,
  messageType: String,
  sender: {
    id: String,
    username: String,
    avatar: String,
  },
  receiver: {
    id: String,
    username: String,
    avatar: String,
  },
  text: String,
  file: { data: Buffer, contentType: String, fileName: String },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null },
});

const MESSAGE_CONVERSATIONS = {
  PERSONAL: "personal",
  GROUP: "group",
};

const MESSAGE_TYPE = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file",
};

MessageSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  getMessagesInPersonal(senderId, receivedId, limit) {
    return this.find({
      $or: [
        { $and: [{ senderId: senderId }, { receiverId: receivedId }] },
        { $and: [{ senderId: receivedId }, { receiverId: senderId }] },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },

  getMessagesInGroup(receiverId, limit) {
    return this.find({ receiverId: receivedId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },
};
module.exports = {
  model: mongoose.model("message", MessageSchema),
  conversationTypes: MESSAGE_CONVERSATIONS,
  messageTypes: MESSAGE_TYPE,
};
