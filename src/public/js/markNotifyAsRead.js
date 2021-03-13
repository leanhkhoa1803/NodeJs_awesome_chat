function markNotifyAsRead(targetUser) {
  $.ajax({
    url: "/notification/mark-all-as-read",
    type: "put",
    data: { targetUser: targetUser },
    success: function (result) {
      if (result) {
        targetUser.forEach(function (uid) {
          //popup notification
          $(".noti_content")
            .find(`div[data-uid = ${uid}]`)
            .removeClass("unread-notifications");

          //modal notification
          $("ul.list-notifications")
            .find(`li>div[data-uid = ${uid}]`)
            .removeClass("unread-notifications");
        });

        //reset count notifications
        decreaseNumberNotifyCation("noti_counter", targetUser.length);
      }
    },
  });
}

$(document).ready(function () {
  //link popup notification
  $("#popup-mark-notif-isRead").bind("click", function () {
    let targetUser = [];
    $(".noti_content")
      .find("div.unread-notifications")
      .each(function (index, notification) {
        targetUser.push($(notification).data("uid"));
      });
    if (!targetUser.length) {
      alertify.notify("Tất cả thông báo đã được đọc", "error", 5);
      return false;
    }
    markNotifyAsRead(targetUser);
  });
  //link modal notification
  $("#modal-mark-notify-as-read").bind("click", function () {
    let targetUser = [];
    $("ul.list-notifications")
      .find("li>div.unread-notifications")
      .each(function (index, notification) {
        targetUser.push($(notification).data("uid"));
      });
    if (!targetUser.length) {
      alertify.notify("Tất cả thông báo đã được đọc", "error", 5);
      return false;
    }
    markNotifyAsRead(targetUser);
  });
});
