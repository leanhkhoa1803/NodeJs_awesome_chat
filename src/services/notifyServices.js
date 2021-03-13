const notifyCationModel = require("../models/notificationsModel");
const UserModel = require("../models/usersModel");

const LIMIT_NOTIFICATIONS = 1;
const getNotifyCations = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const notifications = await notifyCationModel.model.getNotifyByUserAndLimit(
        currentUserId,
        LIMIT_NOTIFICATIONS
      );
      const getNotifyContents = notifications.map(async (notification) => {
        const sender = await UserModel.getDataByUserId(notification.senderId);
        return notifyCationModel.contents.getContents(
          notification.type,
          notification.isRead,
          sender._id,
          sender.username,
          sender.avatar
        );
      });

      resolve(await Promise.all(getNotifyContents));
    } catch (error) {
      reject(error);
    }
  });
};

const countNotifyUnread = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const countNotifyUnread = await notifyCationModel.model.countNotifyUnread(
        currentUserId
      );
      resolve(countNotifyUnread);
    } catch (error) {
      reject(error);
    }
  });
};

const readMore = (currentUserId, skipNumberNotify) => {
  return new Promise(async (resolve, reject) => {
    try {
      const newNotifyCations = await notifyCationModel.model.readMore(
        currentUserId,
        skipNumberNotify,
        LIMIT_NOTIFICATIONS
      );

      const getNotifyContents = newNotifyCations.map(async (notification) => {
        const sender = await UserModel.getDataByUserId(notification.senderId);
        return notifyCationModel.contents.getContents(
          notification.type,
          notification.isRead,
          sender._id,
          sender.username,
          sender.avatar
        );
      });

      resolve(await Promise.all(getNotifyContents));
    } catch (error) {
      reject(error);
    }
  });
};

const markNotifyAsRead = (currentUserId, targetUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      await notifyCationModel.model.markNotifyAsRead(currentUserId, targetUser);
      resolve(true);
    } catch (error) {
      reject(false);
    }
  });
};

module.exports = {
  getNotifyCations: getNotifyCations,
  countNotifyUnread: countNotifyUnread,
  readMore: readMore,
  markNotifyAsRead: markNotifyAsRead,
};
