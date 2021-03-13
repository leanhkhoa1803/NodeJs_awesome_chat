const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  senderId: String,
  receiverId: String,
  type: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
});

NotificationSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  removeRequestContactNotification(senderId, receiverId, type) {
    return this.deleteOne({
      $and: [
        { senderId: senderId },
        { receiverId: receiverId },
        { type: type },
      ],
    }).exec();
  },

  getNotifyByUserAndLimit(userId, limit) {
    return this.find({
      receiverId: userId,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },

  countNotifyUnread(userId) {
    return this.countDocuments({
      $and: [{ receiverId: userId }, { isRead: false }],
    }).exec();
  },

  readMore(userId, skip, limit) {
    return this.find({
      receiverId: userId,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },

  markNotifyAsRead(userId, targetUser) {
    return this.updateMany(
      { $and: [{ receiverId: userId }, { senderId: { $in: targetUser } }] },
      { isRead: true }
    ).exec();
  },
};

const NOTIFICATION_TYPES = {
  ADD_CONTACT: "add_contact",
  ACCEPT_CONTACT: "accept_contact",
};

const NOTIFICATION_CONTENTS = {
  getContents: (notifyCationType, isRead, userId, userName, userAvatar) => {
    if (notifyCationType === NOTIFICATION_TYPES.ADD_CONTACT) {
      if (!isRead) {
        return `<div class="unread-notifications" data-uid="${userId}">
        <img class="avatar-small" src="images/users/${userAvatar}"
            alt="">
        <strong >${userName}</strong> đã gửi cho bạn một lời mời kết bạn!
      </div>`;
      } else {
        return `<div data-uid="${userId}">
      <img class="avatar-small " src="images/users/${userAvatar}"
          alt="">
      <strong>${userName}</strong> đã gửi cho bạn một lời mời kết bạn!
    </div>`;
      }
    }

    if (notifyCationType === NOTIFICATION_TYPES.ACCEPT_CONTACT) {
      if (!isRead) {
        return `<div class="unread-notifications" data-uid="${userId}">
        <img class="avatar-small" src="images/users/${userAvatar}"
            alt="">
        <strong >${userName}</strong> Đã chấp nhận lời mời kết bạn!
      </div>`;
      } else {
        return `<div data-uid="${userId}">
      <img class="avatar-small " src="images/users/${userAvatar}"
          alt="">
      <strong>${userName}</strong> Đã chấp nhận lời mời kết bạn!
    </div>`;
      }
    }
    return "No matching with any notifycations type";
  },
};
module.exports = {
  model: mongoose.model("notification", NotificationSchema),
  types: NOTIFICATION_TYPES,
  contents: NOTIFICATION_CONTENTS,
};
