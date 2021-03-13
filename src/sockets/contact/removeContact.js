const {
  pushSocketToArr,
  emitNotifyCation,
  removeSocketIdFromArr,
} = require("../../helpers/socketHelper");

let removeContact = (io) => {
  let clients = {};
  io.on("connection", (socket) => {
    let currentId = socket.request.user.id;
    //kiem tra neu moi dang nhap thi tao mang luu key:currentUserId value : socket.request.user.id
    clients = pushSocketToArr(clients, currentId, socket.id);

    socket.on("remove-contact", (data) => {
      let currentUser = {
        id: socket.request.user._id,
      };

      //emit notification
      if (clients[data.contactId]) {
        emitNotifyCation(
          clients,
          data.contactId,
          io,
          "response-remove-contact",
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

module.exports = removeContact;
