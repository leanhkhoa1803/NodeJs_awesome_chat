const pushSocketToArr = (clients, userId, socketId) => {
  if (clients[userId]) {
    clients[userId].push(socketId);
  } else {
    clients[userId] = [socketId];
  }
  return clients;
};

const emitNotifyCation = (clients, userId, io, eventName, data) => {
  clients[userId].forEach((socketId) => {
    io.sockets.connected[socketId].emit(eventName, data);
  });
};

const removeSocketIdFromArr = (clients, userId, socket) => {
  clients[userId] = clients[userId].filter(function (socketId) {
    return socketId !== socket.id;
  });

  if (!clients[userId].length) {
    delete clients[userId];
  }
  return clients;
};
module.exports = {
  pushSocketToArr: pushSocketToArr,
  emitNotifyCation: emitNotifyCation,
  removeSocketIdFromArr: removeSocketIdFromArr,
};
