const {
  pushSocketToArr,
  emitNotifyCation,
  removeSocketIdFromArr,
} = require("../../helpers/socketHelper");

let acceptRequestContactReceived = (io) => {
  let clients = {};
  io.on("connection", (socket) => {
    let currentId = socket.request.user.id;
    //kiem tra neu moi dang nhap thi tao mang luu key:currentUserId value : socket.request.user.id
    clients = pushSocketToArr(clients, currentId, socket.id);

    socket.on("accept-request-contact-received", (data) => {
      let currentUser = {
        id: socket.request.user._id,
        username: socket.request.user.username,
        avatar: socket.request.user.avatar,
        address:
          socket.request.user.address !== null
            ? socket.request.user.address
            : "",
      };

      //emit notification
      if (clients[data.contactId]) {
        emitNotifyCation(
          clients,
          data.contactId,
          io,
          "response-accept-request-contact-received",
          currentUser
        );
      }
    });

    //kiem tra neu khong truy cap nua thi t xoa bot socket
    socket.on("disconnect", function () {
      clients = removeSocketIdFromArr(clients, socket.request.user.id, socket);
    });
  });
};

module.exports = acceptRequestContactReceived;
