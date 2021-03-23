function textAndEmojiChat(divId) {
  $(".emojionearea")
    .unbind("keyup")
    .on("keyup", function (element) {
      let currentEmojiChat = $(this);
      if (element.which === 13) {
        let targetId = $(`#write-chat-${divId}`).data("chat");
        let messageValue = $(`#write-chat-${divId}`).val();
        messageValue = messageValue.trim();
        if (!targetId.length || !messageValue.length) {
          $(`#write-chat-${divId}`).val("");
          currentEmojiChat.find(".emojionearea-editor").text("");
          typing_Off(divId);
          return false;
        }

        let dataTextEmojiForSend = {
          uid: targetId,
          messageValue: messageValue,
        };

        if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
          dataTextEmojiForSend.isChatGroup = true;
        }

        $.post(
          "/message/add-new-text-emoji",
          dataTextEmojiForSend,
          function (data) {
            let dataToEmit = {
              message: data.message,
            };
            //b1 : chinh sua du lieu
            let messageOfMe = $(
              `<div class="bubble me" data-mess-id="${data.message._id}">
              <img src="/images/users/${data.message.sender.avatar}" class="avatar-small"
                title="${data.message.sender.username}">
                ${data.message.text}
              </div>`
            );
            if (dataTextEmojiForSend.isChatGroup) {
              dataToEmit.groupId = targetId;
              increaseNumberMessageGroup(divId);
            } else {
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
            //b3 : remove data on input
            $(`#write-chat-${divId}`).val("");
            currentEmojiChat.find(".emojionearea-editor").text("");

            //b4 :change data preview and left side
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
              .html(data.message.text);
            //b5 :move conversation to top
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

            //b6 :emit realtime
            socket.emit("chat-text-emoji", dataToEmit);

            //b7 :emit remove typing real time
            typing_Off(divId);
            //b8 : remove typing if chat group
            let check = $(`.chat[data-chat = ${divId}]`).find(
              "div.bubble-typing-gif"
            );
            if (check.length) {
              return false;
            }
          }
        ).fail(function (response) {
          alertify.notify(response.responseText, "error", 5);
        });
      }
    });
}

$(document).ready(function () {
  socket.on("response-chat-text-emoji", function (response) {
    let divId = "";
    //b1 : chinh sua du lieu
    let messageOfYou = $(
      `<div class="bubble you" data-mess-id="${response.message._id}">
      <img src="/images/users/${response.message.sender.avatar}" class="avatar-small"
        title="${response.message.sender.username}">
        ${response.message.text}
      </div>`
    );

    if (response.currentGroupId) {
      divId = response.currentGroupId;

      nineScrollRight(divId);
      if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
        increaseNumberMessageGroup(divId);
      }
    } else {
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
      .html(response.message.text);

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
  });
});
