const mongoose = require("mongoose");
const { find } = require("./contactModel");

const Schema = mongoose.Schema;

const ChatGroupSchema = new Schema({
  name: String,
  userAmount: { type: Number, min: 3, max: 200 },
  messageAmount: { type: Number, default: 0 },
  userId: String,
  members: [{ userId: String }],

  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now },
  deletedAt: { type: Number, default: null },
});

ChatGroupSchema.statics = {
  getChatGroups(userId, limit) {
    return this.find({
      members: { $elemMatch: { userId: userId } },
    })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .exec();
  },

  getChatGroupById(id) {
    return this.findById(id).exec();
  },

  updateWhenNewMessage(id, newMessageAmount) {
    return this.findOneAndUpdate({ id }, [
      { messageAmount: newMessageAmount },
      { updatedAt: Date.now() },
    ]).exec();
  },

  getChatGroupIdByUser(userId) {
    return this.find(
      {
        members: { $elemMatch: { userId: userId } },
      },
      { _id: 1 }
    ).exec();
  },
};

module.exports = mongoose.model("chatgroup", ChatGroupSchema);
