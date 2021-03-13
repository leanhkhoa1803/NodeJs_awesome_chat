$(document).ready(function () {
  $("#link-read-more-notify").bind("click", function () {
    let skipNumber = $("ul.list-notifications").find("li").length;

    $("#link-read-more-notify").css("display", "none");
    $(".lds-hourglass").css("display", "inline-block");

    $.get(
      `/notifycation/read-more?skipNumber=${skipNumber}`,
      function (notifications) {
        if (!notifications.length) {
          alertify.notify("Đã hết thông báo !!!", "error", 5);
          $("#link-read-more-notify").css("display", "inline-block");
          $(".lds-hourglass").css("display", "none");
          return false;
        } else {
          notifications.forEach(function (notification) {
            $("ul.list-notifications").append(`<li>${notification}</li>`);
            $("#link-read-more-notify").css("display", "inline-block");
            $(".lds-hourglass").css("display", "none");
          });
        }
      }
    );
  });
});
