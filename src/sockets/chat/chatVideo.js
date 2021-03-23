const {
  pushSocketToArr,
  emitNotifyCation,
  removeSocketIdFromArr,
} = require("../../helpers/socketHelper");

let chatVideo = (io) => {
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
    socket.on("caller-check-listener-online-or-not", (data) => {
      if (clients[data.listenerId]) {
        //online
        let response = {
          callerId: socket.request.user._id,
          listenerId: data.listenerId,
          callerName: data.callerName,
        };
        emitNotifyCation(
          clients,
          data.listenerId,
          io,
          "server-request-peerid-of-listener",
          response
        );
      } else {
        socket.emit("server-send-listener-is-offline");
      }
    });

    socket.on("listener-emit-peerId-to-server", (data) => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeer: data.listenerPeer,
      };

      if (clients[data.callerId]) {
        emitNotifyCation(
          clients,
          data.callerId,
          io,
          "server-send-peerId-of-listener-for-caller",
          response
        );
      }
    });
    //Step 6: listener lang nghe su kien server goi toi

    socket.on("caller-request-call-to-server", (data) => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeer: data.listenerPeer,
      };

      if (clients[data.listenerId]) {
        emitNotifyCation(
          clients,
          data.listenerId,
          io,
          "server-send-request-call-to-listener",
          response
        );
      }
    });
    //Step 7: listener lang nghe su kien cancel call
    socket.on("caller-cancel-request-call-to-server", (data) => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeer: data.listenerPeer,
      };

      if (clients[data.listenerId]) {
        emitNotifyCation(
          clients,
          data.listenerId,
          io,
          "server-send-request-cancel-call-to-listener",
          response
        );
      }
    });

    //Step 10: listener tu choi cuoc goi
    socket.on("listener-dimiss-request-call-to-server", (data) => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeer: data.listenerPeer,
      };

      if (clients[data.callerId]) {
        emitNotifyCation(
          clients,
          data.callerId,
          io,
          "server-send-reject-cancel-call-to-caller",
          response
        );
      }
    });

    //Step 11: listener dong y cuoc goi
    socket.on("listener-accept-request-call-to-server", (data) => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeer: data.listenerPeer,
      };

      if (clients[data.callerId]) {
        emitNotifyCation(
          clients,
          data.callerId,
          io,
          "server-send-accept-call-to-caller",
          response
        );
      }
      if (clients[data.listenerId]) {
        emitNotifyCation(
          clients,
          data.listenerId,
          io,
          "server-send-accept-call-to-listener",
          response
        );
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

module.exports = chatVideo;
