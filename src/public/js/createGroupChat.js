function addFriendsToGroup() {
  $("ul#group-chat-friends")
    .find("div.add-user")
    .bind("click", function () {
      let uid = $(this).data("uid");
      $(this).remove();
      let html = $("ul#group-chat-friends")
        .find("div[data-uid=" + uid + "]")
        .html();

      let promise = new Promise(function (resolve, reject) {
        $("ul#friends-added").append(html);
        $("#groupChatModal .list-user-added").show();
        resolve(true);
      });
      promise.then(function (success) {
        $("ul#group-chat-friends")
          .find("div[data-uid=" + uid + "]")
          .remove();
      });
    });
}

function cancelCreateGroup() {
  $("#btn-cancel-group-chat").bind("click", function () {
    $("#groupChatModal .list-user-added").hide();
    if ($("ul#friends-added>li").length) {
      $("ul#friends-added>li").each(function (index) {
        $(this).remove();
      });
    }
  });
}

function callSearchFriend(element) {
  if (element.which === 13 || element.type === "click") {
    let keyword = $("#input-search-friends-to-add-group-chat").val();
    let regexUsername = new RegExp(
      /^[s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
    );
    if (!keyword.length) {
      alertify.notify("Chưa nhập từ khóa tìm kiếm", "error", 5);
      return false;
    }

    if (!regexUsername.test(keyword)) {
      alertify.notify(
        "Tên giới hạn từ 3-17 kí tự và không chứa kí tự đặc biệt",
        "error",
        5
      );
      return false;
    }

    $.get(`/contact/search-friends/${keyword}`, function (data) {
      $("ul#group-chat-friends").html(data);
      // Thêm người dùng vào danh sách liệt kê trước khi tạo nhóm trò chuyện
      addFriendsToGroup();

      // Action hủy việc tạo nhóm trò chuyện
      cancelCreateGroup();
    });
  }
}

function callCreateGroupChat() {
  $("#btn-create-group-chat")
    .unbind("click")
    .on("click", function () {
      let countUsers = $("ul#friends-added").find("li");
      if (countUsers.length < 2) {
        alertify.notify("Nhóm trò chuyện tối thiểu 2 người", "error", 5);
        return false;
      }

      let groupChatname = $("#input-name-group-chat").val();
      if (groupChatname.length < 1) {
        alertify.notify("Vui lòng nhập tên nhóm trò chuyện", "error", 5);
        return false;
      }
      let arrayIds = [];
      $("ul#friends-added")
        .find("li")
        .each(function (index, item) {
          arrayIds.push({ userId: $(item).data("uid") });
        });

      $.post(
        "/group-chat/add-new",
        {
          arrayIds: arrayIds,
          groupChatname: groupChatname,
        },
        function (data) {
          //Step1 : hide modal
          $("#input-name-group-chat").val("");
          $("#btn-cancel-group-chat").click();
          $("#groupChatModal").modal("hide");

          //Step2: show info left side
          let subGroupChatName = data.groupChat.name;
          if (subGroupChatName.length > 15) {
            subGroupChatName = subGroupChatName.substr(0, 14);
          }

          let leftSideData = `
              <a href="#uid_${data.groupChat._id}" class="room-chat" data-target="#to_${data.groupChat._id}">
                <li class="person group-chat" data-chat="${data.groupChat._id}">
                    <div class="left-avatar">
                        <img src="images/users/group-avatar.png" alt="">
                    </div>
                    <span class="name">
                        <span class="group-chat-name">
                          ${subGroupChatName}<span>...</span>
                        </span>
                    </span>
                    <span class="time">
                    </span>
                    <span class="preview convert-emoji">
                    </span>
                </li>
              </a>`;

          $("#all-chat").find("ul").prepend(leftSideData);
          $("#group-chat").find("ul").prepend(leftSideData);

          //Step3:show info rightSide
          let rightSideData = `
              <div class="right tab-pane" data-chat="${data.groupChat._id}" id="to_${data.groupChat._id}">
                <div class="top">
                    <span>To: <span class="name">${data.groupChat.name}</span></span>
                    <span class="chat-menu-right">
                        <a href="#attachmentsModal_${data.groupChat._id}" id="show-attachments" data-toggle="modal">
                            Tệp đính kèm
                            <i class="fa fa-paperclip"></i>
                        </a>
                    </span>
                    <span class="chat-menu-right">
                        <a href="javascript:void(0)">&nbsp;</a>
                    </span>
                    <span class="chat-menu-right">
                        <a href="#imagesModal_${data.groupChat._id}" class="show-images" data-toggle="modal">
                            Hình ảnh
                            <i class="fa fa-photo"></i>
                        </a>
                    </span>
                    <span class="chat-menu-right">
                        <a href="javascript:void(0)">&nbsp;</a>
                    </span>
                    <span class="chat-menu-right">
                        <a href="#membersModal_${data.groupChat._id}" id="number-numbers" data-toggle="modal">
                            <span class="show-number-members">
                            ${data.groupChat.userAmount}
                            </span>
                            Thành viên
                            <i class="fa fa-users"></i>
                        </a>
                    </span>
                    <span class="chat-menu-right">
                        <a href="javascript:void(0)">&nbsp;</a>
                    </span>
                    <span class="chat-menu-right">
                        <a href="javascript:void(0)" id="number-numbers" data-toggle="modal">
                            <span class="number-messages-show">${data.groupChat.messageAmount}</span>
                            <i class="fa fa-comment-o"></i>
                        </a>
                    </span>
                </div>
                <div class="content-chat">
                    <div class="chat chat-in-group" data-chat="${data.groupChat._id}">
                    </div>
                </div>
                <div class="write" data-chat="${data.groupChat._id}">
                    <input type="text" class="write-chat chat-in-group" id="write-chat-${data.groupChat._id}" data-chat="${data.groupChat._id}">
                    <div class="icons">
                        <a href="#" class="icon-chat" data-chat="${data.groupChat._id}"><i class="fa fa-smile-o"></i></a>
                        <label for="image-chat-${data.groupChat._id}">
                            <input type="file" id="image-chat-${data.groupChat._id}" name="my-image-chat" class="image-chat chat-in-group" data-chat="${data.groupChat._id}">
                            <i class="fa fa-photo"></i>
                        </label>
                        <label for="attachment-chat-${data.groupChat._id}">
                            <input type="file" id="attachment-chat-${data.groupChat._id}" name="my-attachment-chat" class="attachment-chat chat-in-group" data-chat="${data.groupChat._id}">
                            <i class="fa fa-paperclip"></i>
                        </label>
                        <a href="javascript:void(0)" id="video-chat-group">
                            <i class="fa fa-video-camera"></i>
                        </a>
                    </div>
                </div>
              </div>`;

          $("#screen-chat").prepend(rightSideData);
          //Step4 : Call function changScreenChat
          changScreenChat();
          //Step 5 :show info image modal
          let imageModalData = `<div class="modal fade" id="imagesModal_${data.groupChat._id}" role="dialog">
          <div class="modal-dialog modal-lg">
              <div class="modal-content">
                  <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal">&times;</button>
                      <h4 class="modal-title">Toàn bộ ảnh trong cuộc trò chuyện
                      </h4>
                  </div>
                  <div class="modal-body">
                      <div class="all-images" style="visibility: hidden;">
                         
                      </div>
                  </div>
              </div>
          </div>
      </div>`;
          $("body").append(imageModalData);

          //Step6 : Call function gridPhoto
          gridPhotos(5);

          //Step7 : show info attachment modal
          let attachmentModalData = `
          <div class="modal fade" id="attachmentsModal_${data.groupChat._id}" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Tất cả tệp đính kèm trong cuộc trò chuyện</h4>
                </div>
                <div class="modal-body">
                    <ul class="list-attachments">
                        
                    </ul>
                </div>
            </div>
        </div>
    </div>
          `;
          $("body").append(attachmentModalData);

          //Step8 : Emit new group created
          socket.emit("new-group-created", { groupChat: data.groupChat });

          socket.emit("check-status");
          $("body").append(data.membersModalData);

          userTalk();
        }
      ).fail(function (response) {
        alertify.notify(response.responseText, "error", 5);
      });
    });
}

$(document).ready(function () {
  $("#input-search-friends-to-add-group-chat").bind(
    "keypress",
    callSearchFriend
  );
  $("#btn-search-friends-to-add-group-chat").bind("click", callSearchFriend);
  callCreateGroupChat();

  socket.on("response-new-group-created", function (response) {
    //Step1 : hide modal : nothing code
    //Step2: show info left side
    let subGroupChatName = response.groupChat.name;
    if (subGroupChatName.length > 15) {
      subGroupChatName = subGroupChatName.substr(0, 14);
    }
    let leftSideData = `
      <a href="#uid_${response.groupChat._id}" class="room-chat" data-target="#to_${response.groupChat._id}">
        <li class="person group-chat" data-chat="${response.groupChat._id}">
            <div class="left-avatar">
                <img src="images/users/group-avatar.png" alt="">
            </div>
            <span class="name">
                <span class="group-chat-name">
                  ${subGroupChatName}
                </span>
            </span>
            <span class="time">
            </span>
            <span class="preview convert-emoji">
            </span>
        </li>
      </a>`;

    $("#all-chat").find("ul").prepend(leftSideData);
    $("#group-chat").find("ul").prepend(leftSideData);

    //Step3:show info rightSide
    let rightSideData = `
              <div class="right tab-pane" data-chat="${response.groupChat._id}" id="to_${response.groupChat._id}">
                <div class="top">
                    <span>To: <span class="name">${response.groupChat.name}</span></span>
                    <span class="chat-menu-right">
                        <a href="#attachmentsModal_${response.groupChat._id}" id="show-attachments" data-toggle="modal">
                            Tệp đính kèm
                            <i class="fa fa-paperclip"></i>
                        </a>
                    </span>
                    <span class="chat-menu-right">
                        <a href="javascript:void(0)">&nbsp;</a>
                    </span>
                    <span class="chat-menu-right">
                        <a href="#imagesModal_${response.groupChat._id}" class="show-images" data-toggle="modal">
                            Hình ảnh
                            <i class="fa fa-photo"></i>
                        </a>
                    </span>
                    <span class="chat-menu-right">
                        <a href="javascript:void(0)">&nbsp;</a>
                    </span>
                    <span class="chat-menu-right">
                        <a href="#membersModal_${response.groupChat._id}" id="number-numbers" data-toggle="modal">
                            <span class="show-number-members">
                            ${response.groupChat.userAmount}
                            </span>
                            Thành viên
                            <i class="fa fa-users"></i>
                        </a>
                    </span>
                    <span class="chat-menu-right">
                        <a href="javascript:void(0)">&nbsp;</a>
                    </span>
                    <span class="chat-menu-right">
                        <a href="javascript:void(0)" id="number-numbers" data-toggle="modal">
                            <span class="number-messages-show">${response.groupChat.messageAmount}</span>
                            <i class="fa fa-comment-o"></i>
                        </a>
                    </span>
                </div>
                <div class="content-chat">
                    <div class="chat chat-in-group" data-chat="${response.groupChat._id}">
                    </div>
                </div>
                <div class="write" data-chat="${response.groupChat._id}">
                    <input type="text" class="write-chat chat-in-group" id="write-chat-${response.groupChat._id}" data-chat="${response.groupChat._id}">
                    <div class="icons">
                        <a href="#" class="icon-chat" data-chat="${response.groupChat._id}"><i class="fa fa-smile-o"></i></a>
                        <label for="image-chat-${response.groupChat._id}">
                            <input type="file" id="image-chat-${response.groupChat._id}" name="my-image-chat" class="image-chat chat-in-group" data-chat="${response.groupChat._id}">
                            <i class="fa fa-photo"></i>
                        </label>
                        <label for="attachment-chat-${response.groupChat._id}">
                            <input type="file" id="attachment-chat-${response.groupChat._id}" name="my-attachment-chat" class="attachment-chat chat-in-group" data-chat="${response.groupChat._id}">
                            <i class="fa fa-paperclip"></i>
                        </label>
                        <a href="javascript:void(0)" id="video-chat-group">
                            <i class="fa fa-video-camera"></i>
                        </a>
                    </div>
                </div>
              </div>`;

    $("#screen-chat").prepend(rightSideData);

    //Step4 : Call function changScreenChat
    changScreenChat();

    //Step 5 :show info image modal
    let imageModalData = `
     <div class="modal fade" id="imagesModal_${response.groupChat._id}" role="dialog">
   <div class="modal-dialog modal-lg">
       <div class="modal-content">
           <div class="modal-header">
               <button type="button" class="close" data-dismiss="modal">&times;</button>
               <h4 class="modal-title">Toàn bộ ảnh trong cuộc trò chuyện
               </h4>
           </div>
           <div class="modal-body">
               <div class="all-images" style="visibility: hidden;">
                  
               </div>
           </div>
       </div>
   </div>
</div>
     `;
    $("body").append(imageModalData);

    //Step6 : Call function gridPhoto
    gridPhotos(5);

    //Step7 : show info attachment modal
    let attachmentModalData = `
     <div class="modal fade" id="attachmentsModal_${response.groupChat._id}" role="dialog">
   <div class="modal-dialog modal-lg">
       <div class="modal-content">
           <div class="modal-header">
               <button type="button" class="close" data-dismiss="modal">&times;</button>
               <h4 class="modal-title">Tất cả tệp đính kèm trong cuộc trò chuyện</h4>
           </div>
           <div class="modal-body">
               <ul class="list-attachments">
                   
               </ul>
           </div>
       </div>
   </div>
</div>
     `;
    $("body").append(attachmentModalData);

    //Step8 : Emit new group created : nothing code
    //Step9 : Emit all members received
    socket.emit("member-received-group-chat", {
      groupChatId: response.groupChat._id,
    });

    //Step10 : check status to update online
    socket.emit("check-status");
    $("body").append(response.membersModalData);

    userTalk();
  });
});
