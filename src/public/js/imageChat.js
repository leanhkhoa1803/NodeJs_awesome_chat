function imageChat(divId) {
  $(`#image-chat-${divId}`)
    .unbind("change")
    .on("change", function () {
      let fileData = $(this).prop("files")[0];
      let math = ["image/png", "image/jpg", "image/jpeg"];
      let limit = 1048576; // byte = 1MB

      //kiem tra type image
      if ($.inArray(fileData.type, math) === -1) {
        alertify.notify(
          "Kiểu file không hợp lệ vui lòng chọn file png ,jpg hoặc jpeg",
          "error",
          5
        );
        $(this).val(null);
        return false;
      }

      //kiem tra kich thuoc anh
      if (fileData.size > limit) {
        alertify.notify(
          "Ảnh tối đa upload là 1MB , Vui lòng thử lại",
          "error",
          5
        );
        $(this).val(null);
        return false;
      }

      let targetId = $(this).data("chat");
      let isChatGroup = false;

      let messageFormData = new FormData();
      messageFormData.append("my-image-chat", fileData);
      messageFormData.append("uid", targetId);

      if ($(this).hasClass("chat-in-group")) {
        messageFormData.append("isChatGroup", true);
        isChatGroup = true;
      }

      $.ajax({
        url: "/message/add-new-image",
        type: "post",
        cache: false,
        contentType: false,
        processData: false,
        data: messageFormData,
        success: function (data) {
          let dataToEmit = {
            message: data.message,
          };
          //b1 : chinh sua du lieu
          let messageOfMe = $(`
          <div class="bubble me bubble-image-file " data-mess-id="${data.message._id}"></div>`);

          let imageChat = `<img src="data:${
            data.message.file.contentType
          }; base64, ${bufferToBase64(data.message.file.data.data)}"
          class="show-image-chat">`;

          if (isChatGroup) {
            messageOfMe.html(`<img src="/images/users/${data.message.sender.avatar}" class="avatar-small"
            title="${data.message.sender.username}">`);
            messageOfMe.html(imageChat);

            dataToEmit.groupId = targetId;
            increaseNumberMessageGroup(divId);
          } else {
            messageOfMe.html(imageChat);
            dataToEmit.contactId = targetId;
          }

          //b2 : append message to screen
          $(`.right .chat[data-chat = ${divId}]`).append(messageOfMe);
          nineScrollRight(divId);
          $(`.person[data-chat = ${divId}]`)
            .find("span.name")
            .removeClass("message-name-real-time");
          $(`.person[data-chat = ${divId}]`)
            .find("span.preview")
            .removeClass("message-preview-real-time");
          $(`.person[data-chat = ${divId}]`)
            .find("span.time")
            .removeClass("message-preview-real-time");

          //b3 :change data preview and left side
          $(`.person[data-chat = ${divId}]`)
            .find("span.time")
            .html(
              moment(data.message.createdAt)
                .locale("vi")
                .startOf("seconds")
                .fromNow()
            );
          $(`.person[data-chat = ${divId}]`)
            .find("span.preview")
            .html("Đã gửi hình ảnh");

          //b4 :move conversation to top
          $(`.person[data-chat = ${divId}]`).on(
            "message.moveConversationToTop",
            function () {
              let dataToMove = $(this).parent();
              $(this).closest("ul").prepend(dataToMove);
              $(this).off("message.moveConversationToTop");
            }
          );
          $(`.person[data-chat = ${divId}]`).trigger(
            "message.moveConversationToTop"
          );

          //b5 :emit realtime
          socket.emit("chat-image", dataToEmit);

          //b6 : add image to modal image
          let imageChatToAddModal = `<img
          src="data:${data.message.file.contentType}; base64,${bufferToBase64(
            data.message.file.data.data
          )}">`;

          $(`#imagesModal_${divId}`)
            .find("div.all-images")
            .append(imageChatToAddModal);
        },
        error: function (error) {
          alertify.notify(error.responseText, "error", 5);
        },
      });
    });
}

$(document).ready(function () {
  socket.on("response-chat-image", function (response) {
    let divId = "";
    //b1 : chinh sua du lieu
    let messageOfYou = $(
      `<div class="bubble you bubble-image-file" data-mess-id="${response.message._id}">
      <img src="/images/users/${response.message.sender.avatar}" class="avatar-small"
        title="${response.message.sender.username}">
      </div>`
    );

    let imageChat = `<img src="data:${
      response.message.file.contentType
    }; base64, ${bufferToBase64(response.message.file.data.data)}"
    class="show-image-chat">`;

    if (response.currentGroupId) {
      if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
        messageOfYou.html(imageChat);
        increaseNumberMessageGroup(divId);
        divId = response.currentGroupId;
      }
    } else {
      messageOfYou.html(imageChat);

      divId = response.currentUserId;
    }

    //b2 : append message to screen
    if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
      $(`.right .chat[data-chat = ${divId}]`).append(messageOfYou);
      $(`.person[data-chat = ${divId}]`)
        .find("span.name")
        .addClass("message-name-real-time");
      $(`.person[data-chat = ${divId}]`)
        .find("span.preview")
        .addClass("message-preview-real-time");
      $(`.person[data-chat = ${divId}]`)
        .find("span.time")
        .addClass("message-preview-real-time");
      nineScrollRight(divId);
    }
    //b3 :change data preview and left side
    $(`.person[data-chat = ${divId}]`)
      .find("span.time")
      .html(
        moment(response.message.createdAt)
          .locale("vi")
          .startOf("seconds")
          .fromNow()
      );
    $(`.person[data-chat = ${divId}]`)
      .find("span.preview")
      .html("Đã gửi hình ảnh");

    //b4 :move conversation to top
    $(`.person[data-chat = ${divId}]`).on(
      "message.moveConversationToTop",
      function () {
        let dataToMove = $(this).parent();
        $(this).closest("ul").prepend(dataToMove);
        $(this).off("message.moveConversationToTop");
      }
    );
    $(`.person[data-chat = ${divId}]`).trigger("message.moveConversationToTop");

    //b5 : add image to modal image
    if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
      let imageChatToAddModal = `<img
      src="data:${response.message.file.contentType}; base64,${bufferToBase64(
        response.message.file.data.data
      )}">`;

      $(`#imagesModal_${divId}`)
        .find("div.all-images")
        .append(imageChatToAddModal);
    }
  });
});
