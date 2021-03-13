function removeRequestContactSent() {
  $(".user-remove-request-contact-sent")
    .unbind("click")
    .on("click", function () {
      let targetId = $(this).data("uid");
      $.ajax({
        url: "contact/remove-request-contact-sent",
        type: "DELETE",
        data: { uid: targetId },
        success: function (data) {
          if (data.success) {
            $("#find-user")
              .find(
                `div.user-remove-request-contact-sent[data-uid = ${targetId}]`
              )
              .hide();
            $("#find-user")
              .find(`div.user-add-new-contact[data-uid = ${targetId}]`)
              .css("display", "inline-block");

            decreaseNumberNotifyCation("noti_contact_counter", 1);

            decreaseNumberNotifyContacts("count-request-contact-sent");
            //dom toi tab dang cho xac nhan va xoa di li cua user vua huy kb
            $("#request-contact-sent")
              .find(`li[data-uid = ${targetId}]`)
              .remove();

            socket.emit("remove-request-contact-sent", { contactId: targetId });
          }
        },
      });
    });
}

socket.on("response-remove-request-contact-sent", function (user) {
  //xoa thong bao ket ban
  $(".noti_content").find(`div[data-uid = ${user.id}]`).remove(); //xoa o popup
  $("ul.list-notifications")
    .find(`li>div[data-uid = ${user.id}]`)
    .parent()
    .remove(); //xoa o modal

  $("#request-contact-received").find(`li[data-uid = ${user.id}]`).remove();

  decreaseNumberNotifyContacts("count-request-contact-received");

  decreaseNumberNotifyCation("noti_contact_counter", 1);
  decreaseNumberNotifyCation("noti_counter", 1);
});

$(document).ready(function () {
  removeRequestContactSent();
});
