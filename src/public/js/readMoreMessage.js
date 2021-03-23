function readMoreMessages() {
  $(".right .chat").scroll(function () {
    //get the first message
    let firstMessage = $(this).find(".bubble:first");
    //get position of first message
    let currentOffset = firstMessage.offset().top - $(this).scrollTop();

    if ($(this).scrollTop() === 0) {
      let messageLoading = `<img src="images/chat/message-loading.gif" class="message-loading" />`;
      $(this).prepend(messageLoading);

      let targetId = $(this).data("chat");
      let skipMessage = $(this).find("div.bubble").length;
      let chatInGroup = $(this).hasClass("chat-in-group") ? true : false;

      let thisDom = $(this);
      $.get(
        `/message/read-more?skipMessage=${skipMessage}&targetId=${targetId}&chatInGroup=${chatInGroup}`,
        function (data) {
          if (data.rightSideData.trim() === "") {
            alertify.notify("Đã tải hết tin nhắn", "error", 5);
            thisDom.find("img.message-loading").remove();

            return false;
          }
          //Step1 : handle rightSide
          $(`.right .chat[data-chat = ${targetId}]`).prepend(
            data.rightSideData
          );

          //Step2: prevent scroll
          $(`.right .chat[data-chat = ${targetId}]`).scrollTop(
            firstMessage.offset().top - currentOffset
          );
          //Step3: handle image modal
          $(`#imagesModal_${targetId}`)
            .find("div.all-images")
            .append(data.imageModal);

          //Step4 : call gridPhotos
          gridPhotos(5);

          //Step5 : handle attactmentModal
          $(`#attachmentsModal_${targetId}`)
            .find("ul.list-attachments")
            .append(data.attactmentModal);

          //Step6 : remove message-loading
          thisDom.find("img.message-loading").remove();
        }
      );
    }
  });
}

$(document).ready(function () {
  readMoreMessages();
});
