function attachmentChat(divId) {
  $(`#attachment-chat-${divId}`)
    .unbind("change")
    .on("change", function () {
      let fileData = $(this).prop("files")[0];
      let limit = 1048576; // byte = 1MB
      //kiem tra kich thuoc anh
      if (fileData.size > limit) {
        alertify.notify(
          "Tệp tối đa upload là 1MB , Vui lòng thử lại",
          "error",
          5
        );
        $(this).val(null);
        return false;
      }

      let targetId = $(this).data("chat");
      let isChatGroup = false;

      let messageFormData = new FormData();
      messageFormData.append("my-attachment-chat", fileData);
      messageFormData.append("uid", targetId);

      if ($(this).hasClass("chat-in-group")) {
        messageFormData.append("isChatGroup", true);
        isChatGroup = true;
      }

      $.ajax({
        url: "/message/add-new-attachment",
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
          <div class="bubble me bubble-attachment-file " data-mess-id="${data.message._id}"></div>`);

          let attachmentChat = `<a href="data:${
            data.message.file.contentType
          }; base64, ${bufferToBase64(
            data.message.file.data.data
          )}" download="${data.message.file.fileName}">
          ${data.message.file.fileName}
          </a>`;

          if (isChatGroup) {
            messageOfMe.html(`<img src="/images/users/${data.message.sender.avatar}" class="avatar-small"
            title="${data.message.sender.username}">`);
            messageOfMe.html(attachmentChat);

            dataToEmit.groupId = targetId;
            increaseNumberMessageGroup(divId);
          } else {
            messageOfMe.html(attachmentChat);
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
            .html("Đã gửi tiệp đính kèm");

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
          socket.emit("chat-attachment", dataToEmit);

          //b6 : add image to modal attachment
          let attachmentChatToAddModal = `<li>
            <a href="${data.message.file.contentType}; base64,${bufferToBase64(
            data.message.file.data.data
          )}" download="${data.message.file.fileName}">
                ${data.message.file.fileName}
            </a>
        </li>`;
          $(`#attachmentsModal_${divId}`)
            .find("ul.list-attachments")
            .append(attachmentChatToAddModal);
        },
        error: function (error) {
          alertify.notify(error.responseText, "error", 5);
        },
      });
    });
}

$(document).ready(function () {
  socket.on("response-chat-attachment", function (response) {
    let divId = "";
    //b1 : chinh sua du lieu
    let messageOfYou = $(
      `<div class="bubble you bubble-attachment-file" data-mess-id="${response.message._id}">
      <img src="/images/users/${response.message.sender.avatar}" class="avatar-small"
        title="${response.message.sender.username}">
      </div>`
    );

    let attachmentChat = `<a href="data:${
      response.message.file.contentType
    }; base64, ${bufferToBase64(response.message.file.data.data)}" download="${
      response.message.file.fileName
    }">
    ${response.message.file.fileName}
    </a>`;

    if (response.currentGroupId) {
      divId = response.currentGroupId;
      messageOfYou.html(attachmentChat);
      if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
        increaseNumberMessageGroup(divId);
      }
    } else {
      messageOfYou.html(attachmentChat);

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
      .html("Đã gửi tiệp đính kèm");
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
    //b5 : add attachment to modal
    if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
      let attachmentChatToAddModal = `<li>
            <a href="${
              response.message.file.contentType
            }; base64,${bufferToBase64(
        response.message.file.data.data
      )}" download="${response.message.file.fileName}">
                ${response.message.file.fileName}
            </a>
        </li>`;

      $(`#attachmentsModal_${divId}`)
        .find("ul.list-attachments")
        .append(attachmentChatToAddModal);
    }
  });
});
