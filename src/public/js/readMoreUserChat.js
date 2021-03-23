$(document).ready(function () {
  $("#link-read-more-user-chat").bind("click", function () {
    let skipPersonal = $("#user-chat").find("li:not(.group-chat)").length;

    $("#link-read-more-user-chat").css("display", "none");
    $(".lds-hourglass").css("display", "inline-block");
    $.get(
      `/message/read-more-user-chat?skipPersonal=${skipPersonal}`,
      function (data) {
        if (data.leftSideData.trim() === "") {
          alertify.notify("Đã tải hết tin nhắn", "error", 5);
          $("#link-read-more-user-chat").css("display", "inline-block");
          $(".lds-hourglass").css("display", "none");
          return false;
        }

        //Step1: handle left side
        $("#user-chat").find("ul").append(data.leftSideData);

        //Step2 : handle scroll
        resizeNineScrollLeft();
        nineScrollLeft();

        //step3 : handle right side
        $("#screen-chat").append(data.rightSideData);

        //step4 : call function screen chat
        changScreenChat();

        //Step5 : handle imageModal
        $("body").append(data.imageModal);
        //Step6 : call function gridPhotos
        gridPhotos(5);
        //Step7 : handle attachmentModal
        $("body").append(data.attactmentModal);
        //Step8 :check online
        socket.emit("check-status");

        $("#link-read-more-user-chat").css("display", "inline-block");
        $(".lds-hourglass").css("display", "none");
      }
    );
  });
});
