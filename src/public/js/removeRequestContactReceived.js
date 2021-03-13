function removeRequestContactReceived() {
  $(".user-remove-request-contact-received")
    .unbind("click")
    .on("click", function () {
      let targetId = $(this).data("uid");
      $.ajax({
        url: "/contact/remove-request-contact-received",
        type: "DELETE",
        data: { uid: targetId },
        success: function (data) {
          if (data.success) {
            //xoa thong bao o popup va modal
            // $(".noti_content").find(`div[data-uid = ${user.id}]`).remove(); //xoa o popup
            // $("ul.list-notifications")
            //   .find(`li>div[data-uid = ${user.id}]`)
            //   .parent()
            //   .remove(); //xoa o modal
            //decreaseNumberNotifyCation("noti_counter", 1);

            decreaseNumberNotifyCation("noti_contact_counter", 1);

            decreaseNumberNotifyContacts("count-request-contact-received");

            //xoa thong bao ket ban

            $("#request-contact-received")
              .find(`li[data-uid = ${targetId}]`)
              .remove();

            socket.emit("remove-request-contact-received", {
              contactId: targetId,
            });
          }
        },
      });
    });
}

socket.on("response-remove-request-contact-received", function (user) {
  $("#find-user")
    .find(`div.user-remove-request-contact-sent[data-uid = ${user.id}]`)
    .hide();
  $("#find-user")
    .find(`div.user-add-new-contact[data-uid = ${user.id}]`)
    .css("display", "inline-block");

  //dom toi tab dang cho xac nhan va xoa di li cua user vua huy kb
  $("#request-contact-sent").find(`li[data-uid = ${user.id}]`).remove();

  decreaseNumberNotifyContacts("count-request-contact-sent");

  decreaseNumberNotifyCation("noti_contact_counter", 1);
});

$(document).ready(function () {
  removeRequestContactReceived();
});
