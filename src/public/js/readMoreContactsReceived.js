$(document).ready(function () {
  $("#link-read-more-contacts-received").bind("click", function () {
    let skipNumber = $("#request-contact-received").find("li").length;

    $("#link-read-more-contacts-received").css("display", "none");
    $(".lds-hourglass").css("display", "inline-block");

    $.get(
      `/contact/read-more-contacts-received?skipNumber=${skipNumber}`,
      function (newContactsUsers) {
        if (!newContactsUsers.length) {
          alertify.notify("Đã hết danh sách !!!", "error", 5);
          $("#link-read-more-contacts-received").css("display", "inline-block");
          $(".lds-hourglass").css("display", "none");
          return false;
        } else {
          newContactsUsers.forEach(function (user) {
            const newUser = `<li class="_contactList" data-uid="${user._id}">
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
                        <span>&nbsp ${
                          user.address !== null ? user.address : ""
                        }</span>
                    </div>
                    <div class="user-accept-request-contact-received" data-uid="${
                      user._id
                    }">
                        Chấp nhận
                    </div>
                    <div class="user-remove-request-contact-received action-danger"
                        data-uid="${user._id}">
                        Xóa yêu cầu
                    </div>
                </div>
            </li>`;
            $("#request-contact-received").find("ul").append(newUser);
          });

          $("#link-read-more-contacts-received").css("display", "inline-block");
          $(".lds-hourglass").css("display", "none");

          removeRequestContactReceived();
          acceptRequestContactReceived();
        }
      }
    );
  });
});
