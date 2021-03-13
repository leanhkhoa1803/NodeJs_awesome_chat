const notifyCationService = require("../services/notifyServices");
const readMore = async (req, res) => {
  try {
    let skipNumberNotify = +req.query.skipNumber;
    let newNotifyCations = await notifyCationService.readMore(
      req.user._id,
      skipNumberNotify
    );

    return res.status(200).send(newNotifyCations);
  } catch (error) {
    return res.status(200).send({ error });
  }
};

const markNotifyAsRead = async (req, res) => {
  try {
    let mark = await notifyCationService.markNotifyAsRead(
      req.user._id,
      req.body.targetUser
    );
    return res.status(200).send(mark);
  } catch (error) {
    return res.status(200).send({ error });
  }
};

module.exports = {
  readMore: readMore,
  markNotifyAsRead: markNotifyAsRead,
};
