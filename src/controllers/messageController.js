const { validationResult } = require("express-validator");
const messageService = require("../services/messageService");
const multer = require("multer");
const { config } = require("../config/config");
const { transErrors, transSuccess } = require("../../lang/vi");
const fsExtra = require("fs-extra");
const ejs = require("ejs");
const {
  getLastItemOfArray,
  covertTimeStamp,
  bufferToBase64,
} = require("../helpers/clientHelper");
const { promisify } = require("util");

//make ejs function renderFile available with async await
const renderFile = promisify(ejs.renderFile).bind(ejs);

const addNewTextEmoji = async (req, res) => {
  //check input
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
    let sender = {
      id: req.user._id,
      username: req.user.username,
      avatar: req.user.avatar,
    };

    let receiverId = req.body.uid;
    let messageValue = req.body.messageValue;
    let isChatGroup = req.body.isChatGroup;

    let newMessage = await messageService.addNewTextEmoji(
      sender,
      receiverId,
      messageValue,
      isChatGroup
    );
    return res.status(200).send({ message: newMessage });
  } catch (error) {
    return res.status(500).send(error);
  }
};

//Handle message image
const storageImageChat = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, config.image_message_chat_directory);
  },
  filename: (req, file, callback) => {
    let math = config.image_message_type;
    if (math.indexOf(file.mimetype) === -1) {
      return callback(transErrors.image_message_type, null);
    }

    let imageName = `${file.originalname}`;
    callback(null, imageName);
  },
});

const imageMessageUploadFile = multer({
  storage: storageImageChat,
  limits: config.image_message_limit_size,
}).single("my-image-chat");

const addNewImage = async (req, res) => {
  //check input
  imageMessageUploadFile(req, res, async (err) => {
    if (err) {
      if (err.message) {
        return res.status(500).send(transErrors.image_message_size);
      }
      return res.status(500).send(err);
    } else {
      try {
        let sender = {
          id: req.user._id,
          username: req.user.username,
          avatar: req.user.avatar,
        };

        let receiverId = req.body.uid;
        let messageValue = req.file;
        let isChatGroup = req.body.isChatGroup;

        let newMessage = await messageService.addNewImage(
          sender,
          receiverId,
          messageValue,
          isChatGroup
        );

        //remove image , because it save mongodb
        await fsExtra.remove(
          `${config.image_message_chat_directory}/${newMessage.file.fileName}`
        );
        return res.status(200).send({ message: newMessage });
      } catch (error) {
        return res.status(500).send(error);
      }
    }
  });
};
//Handle message attachment

const storageAttachmentChat = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, config.attachment_message_chat_directory);
  },
  filename: (req, file, callback) => {
    let attachmentName = `${file.originalname}`;
    callback(null, attachmentName);
  },
});

const attachmentMessageUploadFile = multer({
  storage: storageAttachmentChat,
  limits: config.attachment_message_limit_size,
}).single("my-attachment-chat");

const addNewAttachment = async (req, res) => {
  //check input
  attachmentMessageUploadFile(req, res, async (err) => {
    if (err) {
      if (err.message) {
        return res.status(500).send(transErrors.attachment_message_size);
      }
      return res.status(500).send(err);
    } else {
      try {
        let sender = {
          id: req.user._id,
          username: req.user.username,
          avatar: req.user.avatar,
        };

        let receiverId = req.body.uid;
        let messageValue = req.file;
        let isChatGroup = req.body.isChatGroup;

        let newMessage = await messageService.addNewAttachment(
          sender,
          receiverId,
          messageValue,
          isChatGroup
        );

        //remove image , because it save mongodb
        await fsExtra.remove(
          `${config.attachment_message_chat_directory}/${newMessage.file.fileName}`
        );
        return res.status(200).send({ message: newMessage });
      } catch (error) {
        return res.status(500).send(error);
      }
    }
  });
};

const readMoreAllChat = async (req, res) => {
  try {
    let skipPersonal = +req.query.skipPersonal;
    let skipGroup = +req.query.skipGroup;

    let newAllConversations = await messageService.readMoreAllChat(
      req.user._id,
      skipPersonal,
      skipGroup
    );
    let dataRender = {
      newAllConversations: newAllConversations,
      getLastItemOfArray: getLastItemOfArray,
      covertTimeStamp: covertTimeStamp,
      bufferToBase64: bufferToBase64,
      user: req.user,
    };

    let leftSideData = await renderFile(
      "src/views/main/readMoreConversations/_leftSide.ejs",
      dataRender
    );
    let rightSideData = await renderFile(
      "src/views/main/readMoreConversations/_rightSide.ejs",
      dataRender
    );
    let imageModal = await renderFile(
      "src/views/main/readMoreConversations/_imageModal.ejs",
      dataRender
    );
    let attactmentModal = await renderFile(
      "src/views/main/readMoreConversations/_attachmentModal.ejs",
      dataRender
    );
    let membersModalData = await renderFile(
      "src/views/main/readMoreConversationsOfGroupChat/_membersModal.ejs",
      dataRender
    );

    return res.status(200).send({
      leftSideData: leftSideData,
      rightSideData: rightSideData,
      imageModal: imageModal,
      attactmentModal: attactmentModal,
      membersModalData: membersModalData,
    });
  } catch (error) {
    return res.status(200).send({ error });
  }
};

const readMoreUserChat = async (req, res) => {
  try {
    let skipPersonal = +req.query.skipPersonal;

    let newAllConversations = await messageService.readMoreUserChat(
      req.user._id,
      skipPersonal
    );
    let dataRender = {
      newAllConversations: newAllConversations,
      getLastItemOfArray: getLastItemOfArray,
      covertTimeStamp: covertTimeStamp,
      bufferToBase64: bufferToBase64,
      user: req.user,
    };
    let leftSideData = await renderFile(
      "src/views/main/readMoreConversationsOfUser/_leftSide.ejs",
      dataRender
    );
    let rightSideData = await renderFile(
      "src/views/main/readMoreConversationsOfUser/_rightSide.ejs",
      dataRender
    );
    let imageModal = await renderFile(
      "src/views/main/readMoreConversations/_imageModal.ejs",
      dataRender
    );
    let attactmentModal = await renderFile(
      "src/views/main/readMoreConversations/_attachmentModal.ejs",
      dataRender
    );
    return res.status(200).send({
      leftSideData: leftSideData,
      rightSideData: rightSideData,
      imageModal: imageModal,
      attactmentModal: attactmentModal,
    });
  } catch (error) {
    return res.status(200).send({ error });
  }
};

const readMoreGroupChat = async (req, res) => {
  try {
    let skipGroup = +req.query.skipGroup;

    let newAllConversations = await messageService.readMoreGroupChat(
      req.user._id,
      skipGroup
    );
    let dataRender = {
      newAllConversations: newAllConversations,
      getLastItemOfArray: getLastItemOfArray,
      covertTimeStamp: covertTimeStamp,
      bufferToBase64: bufferToBase64,
      user: req.user,
    };

    let leftSideData = await renderFile(
      "src/views/main/readMoreConversationsOfGroupChat/_leftSide.ejs",
      dataRender
    );
    let rightSideData = await renderFile(
      "src/views/main/readMoreConversationsOfGroupChat/_rightSide.ejs",
      dataRender
    );
    let imageModal = await renderFile(
      "src/views/main/readMoreConversations/_imageModal.ejs",
      dataRender
    );
    let attactmentModal = await renderFile(
      "src/views/main/readMoreConversations/_attachmentModal.ejs",
      dataRender
    );
    let membersModalData = await renderFile(
      "src/views/main/readMoreConversationsOfGroupChat/_membersModal.ejs",
      dataRender
    );

    return res.status(200).send({
      leftSideData: leftSideData,
      rightSideData: rightSideData,
      imageModal: imageModal,
      attactmentModal: attactmentModal,
      membersModalData: membersModalData,
    });
  } catch (error) {
    return res.status(200).send({ error });
  }
};

const readMore = async (req, res) => {
  try {
    let skipMessage = +req.query.skipMessage;
    let targetId = req.query.targetId;
    let chatInGroup = req.query.chatInGroup === "true";

    let newMessage = await messageService.readMore(
      req.user._id,
      skipMessage,
      targetId,
      chatInGroup
    );
    let dataRender = {
      newMessage: newMessage,
      bufferToBase64: bufferToBase64,
      user: req.user,
    };
    let rightSideData = await renderFile(
      "src/views/main/readMoreMessage/_rightSide.ejs",
      dataRender
    );
    let imageModal = await renderFile(
      "src/views/main/readMoreMessage/_imageModal.ejs",
      dataRender
    );
    let attactmentModal = await renderFile(
      "src/views/main/readMoreMessage/_attachmentModal.ejs",
      dataRender
    );

    return res.status(200).send({
      rightSideData: rightSideData,
      imageModal: imageModal,
      attactmentModal: attactmentModal,
    });
  } catch (error) {
    console.log(error);
    return res.status(200).send({ error });
  }
};
module.exports = {
  addNewTextEmoji: addNewTextEmoji,
  addNewImage: addNewImage,
  addNewAttachment: addNewAttachment,
  readMoreAllChat: readMoreAllChat,
  readMoreUserChat: readMoreUserChat,
  readMoreGroupChat: readMoreGroupChat,
  readMore: readMore,
};
