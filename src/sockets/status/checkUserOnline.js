const {
  pushSocketToArr,
  emitNotifyCation,
  removeSocketIdFromArr,
} = require("../../helpers/socketHelper");

let checkUserOnline = (io) => {
  let clients = {};
  io.on("connection", (socket) => {
    let currentId = socket.request.user._id;
    //kiem tra neu moi dang nhap thi tao mang luu key:currentUserId value : socket.request.user.id
    clients = pushSocketToArr(clients, currentId, socket.id);
    socket.request.user.chatGroupId.forEach((group) => {
      clients = pushSocketToArr(clients, group._id, socket.id);
    });

    //Step1 : emit to user login or f5
    let listUserOnline = Object.keys(clients);
    socket.emit("server-send-list-user-online", listUserOnline);

    //Step2 : emit to all another user when user online
    socket.broadcast.emit(
      "server-send-when-new-user-online",
      socket.request.user._id
    );

    //kiem tra neu khong truy cap nua thi t xoa bot socket
    socket.on("disconnect", function () {
      clients = removeSocketIdFromArr(clients, socket.request.user._id, socket);
      socket.request.user.chatGroupId.forEach((group) => {
        clients = removeSocketIdFromArr(clients, group._id, socket);
      });

      //Step 3 : Emit to all user when user offline
      socket.broadcast.emit(
        "server-send-when-new-user-offline",
        socket.request.user._id
      );
    });
  });
};

module.exports = checkUserOnline;
