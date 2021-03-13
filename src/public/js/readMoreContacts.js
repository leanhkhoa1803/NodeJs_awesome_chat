$(document).ready(function () {
  $("#link-read-more-contacts").bind("click", function () {
    let skipNumber = $("#contacts").find("li").length;

    $("#link-read-more-contacts").css("display", "none");
    $(".lds-hourglass").css("display", "inline-block");

    $.get(
      `/contact/read-more-contacts?skipNumber=${skipNumber}`,
      function (newContactsUsers) {
        if (!newContactsUsers.length) {
          alertify.notify("Đã hết bạn bè !!!", "error", 5);
          $("#link-read-more-contacts").css("display", "inline-block");
          $(".lds-hourglass").css("display", "none");
          return false;
        } else {
          newContactsUsers.forEach(function (user) {
            const newUser = `<li class="_contactList" data-uid="${
              user._id
            }" title>
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
                <div class="user-talk" data-uid="${user._id}">
                    Trò chuyện
                </div>
                <div class="user-remove-contact action-danger" data-uid="${
                  user._id
                }">
                    Xóa liên hệ
                </div>
            </div>
        </li>`;
            $("#contacts").find("ul").append(newUser);

            removeContact();

            $("#link-read-more-contacts").css("display", "inline-block");
            $(".lds-hourglass").css("display", "none");
          });
        }
      }
    );
  });
});
