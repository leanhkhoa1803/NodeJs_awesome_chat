//step 0 :check status
socket.emit("check-status");

//step1
socket.on("server-send-list-user-online", function (listUserId) {
  listUserId.forEach((userId) => {
    $(`.person[data-chat= ${userId}]`).find("div.dot").addClass("online");
    $(`.person[data-chat= ${userId}]`).find("img").addClass("avatar-online");
  });
});

//Step2
socket.on("server-send-when-new-user-online", function (userId) {
  $(`.person[data-chat= ${userId}]`).find("div.dot").addClass("online");
  $(`.person[data-chat= ${userId}]`).find("img").addClass("avatar-online");
});
//Step3
socket.on("server-send-when-new-user-offline", function (userId) {
  $(`.person[data-chat= ${userId}]`).find("div.dot").removeClass("online");
  $(`.person[data-chat= ${userId}]`).find("img").removeClass("avatar-online");
});
