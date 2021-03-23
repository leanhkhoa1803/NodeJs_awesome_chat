const {
  pushSocketToArr,
  emitNotifyCation,
  removeSocketIdFromArr,
} = require("../../helpers/socketHelper");

let typing_On = (io) => {
  let clients = {};
  io.on("connection", (socket) => {
    let currentId = socket.request.user._id;
    //kiem tra neu moi dang nhap thi tao mang luu key:currentUserId value : socket.request.user.id
    clients = pushSocketToArr(clients, currentId, socket.id);
    socket.request.user.chatGroupId.forEach((group) => {
      clients = pushSocketToArr(clients, group._id, socket.id);
    });
    //push socketid groupchat
    socket.on("new-group-created", (data) => {
      clients = pushSocketToArr(clients, data.groupChat._id, socket.id);
    });
    socket.on("member-received-group-chat", (data) => {
      clients = pushSocketToArr(clients, data.groupChatId, socket.id);
    });

    socket.on("user-is-typing", (data) => {
      if (data.groupId) {
        let response = {
          currentUserId: socket.request.user._id,
          currentGroupId: data.groupId,
        };
        //emit notification
        if (clients[data.groupId]) {
          emitNotifyCation(
            clients,
            data.groupId,
            io,
            "response-user-is-typing",
            response
          );
        }
      }
      if (data.contactId) {
        let response = {
          currentUserId: socket.request.user._id,
        };
        //emit notification
        if (clients[data.contactId]) {
          emitNotifyCation(
            clients,
            data.contactId,
            io,
            "response-user-is-typing",
            response
          );
        }
      }
    });

    //kiem tra neu khong truy cap nua thi t xoa bot socket
    socket.on("disconnect", function () {
      clients = removeSocketIdFromArr(clients, socket.request.user._id, socket);
      socket.request.user.chatGroupId.forEach((group) => {
        clients = removeSocketIdFromArr(clients, group._id, socket);
      });
    });
  });
};

module.exports = typing_On;
