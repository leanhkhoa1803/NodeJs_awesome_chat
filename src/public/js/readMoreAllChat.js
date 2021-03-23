$(document).ready(function () {
  $("#link-read-more-all-chat").bind("click", function () {
    let skipPersonal = $("#all-chat").find("li:not(.group-chat)").length;
    let skipGroup = $("#all-chat").find("li.group-chat").length;

    $("#link-read-more-all-chat").css("display", "none");
    $(".lds-hourglass").css("display", "inline-block");

    $.get(
      `/message/read-more-all-chat?skipPersonal=${skipPersonal}&skipGroup=${skipGroup}`,
      function (data) {
        if (data.leftSideData.trim() === "") {
          alertify.notify("Đã tải hết tin nhắn", "error", 5);
          $("#link-read-more-all-chat").css("display", "inline-block");
          $(".lds-hourglass").css("display", "none");
          return false;
        }

        //Step1: handle left side
        $("#all-chat").find("ul").append(data.leftSideData);

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

        $("#link-read-more-all-chat").css("display", "inline-block");
        $(".lds-hourglass").css("display", "none");
      }
    );
  });
});
