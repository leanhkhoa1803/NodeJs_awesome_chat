const {
  pushSocketToArr,
  emitNotifyCation,
  removeSocketIdFromArr,
} = require("../../helpers/socketHelper");

let newGroupChat = (io) => {
  let clients = {};
  io.on("connection", (socket) => {
    let currentId = socket.request.user._id;
    //kiem tra neu moi dang nhap thi tao mang luu key:currentUserId value : socket.request.user.id
    clients = pushSocketToArr(clients, currentId, socket.id);
    socket.request.user.chatGroupId.forEach((group) => {
      clients = pushSocketToArr(clients, group._id, socket.id);
    });
    socket.on("new-group-created", (data) => {
      clients = pushSocketToArr(clients, data.groupChat._id, socket.id);

      let response = {
        groupChat: data.groupChat,
      };

      data.groupChat.members.forEach((member) => {
        if (
          clients[member.userId] &&
          member.userId != socket.request.user._id
        ) {
          emitNotifyCation(
            clients,
            member.userId,
            io,
            "response-new-group-created",
            response
          );
        }
      });
    });

    socket.on("member-received-group-chat", (data) => {
      clients = pushSocketToArr(clients, data.groupChatId, socket.id);
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

module.exports = newGroupChat;
