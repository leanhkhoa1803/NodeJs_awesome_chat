function addContact() {
  $(".user-add-new-contact").bind("click", function () {
    let targetId = $(this).data("uid");
    $.post("/contact/add-new", { uid: targetId }, function (data) {
      if (data.success) {
        $("#find-user")
          .find(`div.user-add-new-contact[data-uid = ${targetId}]`)
          .hide();
        $("#find-user")
          .find(`div.user-remove-request-contact-sent[data-uid = ${targetId}]`)
          .css("display", "inline-block");

        increaseNumberNotifyCation("noti_contact_counter", 1);

        increaseNumberNotifyContacts("count-request-contact-sent");
        //lay toan bo the li cua user duoc goi loi moi kb
        let userInfoHtml = $("#find-user")
          .find(`ul li[data-uid = ${targetId}]`)
          .get(0).outerHTML;
        //qua tab cho xac nhan add li moi lay duoc len dau tien
        $("#request-contact-sent").find("ul").prepend(userInfoHtml);

        removeRequestContactSent();
        socket.emit("add-new-contact", { contactId: targetId });
      }
    });
  });
}

socket.on("response-add-new-contact", function (user) {
  let notify = `<div class="unread-notifications" data-uid="${user.id}">
  <img class="avatar-small" src="images/users/${user.avatar}"
      alt="">
  <strong>${user.username}</strong> đã gửi cho bạn một lời mời kết bạn!
</div>`;

  $(".noti_content").prepend(notify);

  $("ul.list-notifications").prepend(`<li>${notify}</li>`);
  increaseNumberNotifyContacts("count-request-contact-received");

  increaseNumberNotifyCation("noti_contact_counter", 1);
  increaseNumberNotifyCation("noti_counter", 1);

  //lay ra user goi loi ket ban
  let userInfoHtml = `<li class="_contactList" data-uid="${user.id}">
  <div class="contactPanel">
      <div class="user-avatar">
          <img src="images/users/${user.avatar}" alt=""">
      </div>
      <div class=" user-name">
          <p>
          ${user.username}
          </p>
      </div>
      <br>
      <div class="user-address">
          <span>&nbsp ${user.address}</span>
      </div>
      <div class="user-accept-request-contact-received" data-uid="${user.id}">
          Chấp nhận
      </div>
      <div class="user-remove-request-contact-received action-danger"
          data-uid="${user.id}">
          Xóa yêu cầu
      </div>
  </div>
</li>`;

  //dom toi tab received va prepend user do
  $("#request-contact-received").find("ul").prepend(userInfoHtml);

  removeRequestContactReceived();
  acceptRequestContactReceived();
});
