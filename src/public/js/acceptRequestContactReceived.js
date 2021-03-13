function acceptRequestContactReceived() {
  $(".user-accept-request-contact-received")
    .unbind("click")
    .on("click", function () {
      let targetId = $(this).data("uid");

      $.ajax({
        url: "/contact/accept-request-contact-received",
        type: "put",
        data: { uid: targetId },
        success: function (data) {
          if (data.success) {
            //lay ra the li co uid ma ta da nhan dc
            let userInfo = $("#request-contact-received").find(
              `ul li[data-uid = ${targetId}]`
            );

            //xoa 2 button chap nhan va huy yeu cau o tab yeu cau ket ban
            $(userInfo)
              .find("div.user-accept-request-contact-received")
              .remove();
            $(userInfo)
              .find("div.user-remove-request-contact-received")
              .remove();

            //them 2 button tro chuyen va xoa lien he o tab danh ba
            $(userInfo).find("div.contactPanel")
              .append(`<div class="user-talk" data-uid="${targetId}">
                    Trò chuyện
            </div>
            <div class="user-remove-contact action-danger" data-uid="${targetId}">
                    Xóa liên hệ
            </div>`);
            //lay ra doi tuong html
            let userHTML = userInfo.get(0).outerHTML;
            //dom toi tab danh ba va prepend userHTML
            $("#contacts").find("ul").prepend(userHTML);

            //xoa the li o tab dang cho xac nhan
            $(userInfo).remove();
            //giam di 1 don vi o tab yeu cau kb
            decreaseNumberNotifyContacts("count-request-contact-received");

            increaseNumberNotifyContacts("count-contacts"); //tang 1 don vi o tab danh ba
            decreaseNumberNotifyCation("noti_contact_counter", 1); //giam di 1 thong bao o popup

            removeContact();

            socket.emit("accept-request-contact-received", {
              contactId: targetId,
            });
          }
        },
      });
    });
}

socket.on("response-accept-request-contact-received", function (user) {
  let notify = `<div class="unread-notifications" data-uid="${user.id}">
  <img class="avatar-small" src="images/users/${user.avatar}"
      alt="">
  <strong>${user.username}</strong> Đã chấp nhận lời mời kết bạn !
</div>`;

  $(".noti_content").prepend(notify);

  $("ul.list-notifications").prepend(`<li>${notify}</li>`);

  increaseNumberNotifyCation("noti_counter", 1);
  decreaseNumberNotifyCation("noti_contact_counter", 1);

  increaseNumberNotifyContacts("count-contacts"); //tang 1 don vi o tab danh ba
  decreaseNumberNotifyCation("count-request-contact-sent", 1); //giam di 1 thong bao o popup

  //xoa li o tab dang cho xac nhan va tab tim nguoi dung
  $("#request-contact-sent").find(`ul li[data-uid = ${user.id}]`).remove();
  $("#find-user").find(`ul li[data-uid = ${user.id}]`).remove();

  let userHTML = `<li class="_contactList" data-uid="${user.id}" title>
  <div class="contactPanel">
      <div class="user-avatar">
          <img src="images/users/${user.avatar}" alt="">
      </div>
      <div class="user-name">
          <p>
          ${user.username}
          </p>
      </div>
      <br>
      <div class="user-address">
          <span>&nbsp ${user.address}</span>
      </div>
      <div class="user-talk" data-uid="${user.id}">
          Trò chuyện
      </div>
      <div class="user-remove-contact action-danger" data-uid="${user.id}">
          Xóa liên hệ
      </div>
  </div>
</li>`;

  $("#contacts").find("ul").prepend(userHTML);
  removeContact();
});

$(document).ready(function () {
  acceptRequestContactReceived();
});
