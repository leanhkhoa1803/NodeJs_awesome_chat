$(document).ready(function () {
  $("#link-read-more-contacts-sent").bind("click", function () {
    let skipNumber = $("#request-contact-sent").find("li").length;
    $("#link-read-more-contacts-sent").css("display", "none");
    $(".lds-hourglass").css("display", "inline-block");

    $.get(
      `/contact/read-more-contacts-sent?skipNumber=${skipNumber}`,
      function (newContactsUsers) {
        if (!newContactsUsers.length) {
          alertify.notify("Đã hết danh sách !!!", "error", 5);
          $("#link-read-more-contacts-sent").css("display", "inline-block");
          $(".lds-hourglass").css("display", "none");
          return false;
        } else {
          newContactsUsers.forEach(function (user) {
            const newUser = `<li class="_contactList" data-uid="${user._id}">
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
                      <span>&nbsp ${
                        user.address !== null ? user.address : ""
                      }</span>
                  </div>
                  <div class="user-remove-request-sent action-danger"
                      data-uid="${user._id}">
                      Hủy yêu cầu
                  </div>
              </div>
          </li>`;
            $("#request-contact-sent").find("ul").append(newUser);
          });

          removeRequestContactSent();

          $("#link-read-more-contacts-sent").css("display", "inline-block");
          $(".lds-hourglass").css("display", "none");
        }
      }
    );
  });
});
