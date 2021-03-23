function removeContact() {
  $(".user-remove-contact")
    .unbind("click")
    .on("click", function () {
      let targetId = $(this).data("uid");
      let userName = $(this).parent().find("div.user-name p").text();
      Swal.fire({
        title: `Bạn có chắc chắn muốn xóa ${userName} khỏi danh bạ`,
        text: "Bạn không thể hoàn tác lại quá trình này",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2ECC71",
        cancelButtonColor: "#ff7675",
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy bỏ",
      }).then((result) => {
        if (!result.value) {
          return false;
        }
        $.ajax({
          url: "/contact/remove-contact",
          type: "delete",
          data: { uid: targetId },
          success: function (data) {
            if (data.success) {
              //xoa li o tab danh ba
              $("#contacts").find(`ul li[data-uid = ${targetId}]`).remove();
              //giam di 1 o tab danh ba
              decreaseNumberNotifyContacts("count-contacts");

              socket.emit("remove-contact", {
                contactId: targetId,
              });

              //All step handle chat after remove contacts
              //Step 0 :check active
              let checkActive = $("#all-chat")
                .find(`li[data-chat = ${targetId}]`)
                .hasClass("active");
              //Step1 : remove left side
              $("#all-chat").find(`ul [href="#uid_${targetId}"]`).remove();
              $("#user-chat").find(`ul [href="#uid_${targetId}"]`).remove();

              //Step2 : remove right side
              $("#screen-chat").find(`div#to_${targetId}`).remove();

              //Step3 : remove image modal
              $("body").find(`div#imagesModal_${targetId}`).remove();

              //Step4 : remove attactment modal
              $("body").find(`div#attachmentsModal_${targetId}`).remove();

              //Step5: click conversation first
              if (checkActive) {
                if ($("ul.people").find("a").length) {
                  $("ul.people").find("a")[0].click();
                }
              }
            }
          },
        });
      });
    });
}

socket.on("response-remove-contact", function (user) {
  //xoa li o tab danh ba
  $("#contacts").find(`ul li[data-uid = ${user.id}]`).remove();
  //giam di 1 o tab danh ba
  decreaseNumberNotifyContacts("count-contacts");

  //All step handle chat after remove contacts
  let checkActive = $("#all-chat")
    .find(`li[data-chat = ${user.id}]`)
    .hasClass("active");
  //Step1 : remove left side
  $("#all-chat").find(`ul [href="#uid_${user.id}"]`).remove();
  $("#user-chat").find(`ul [href="#uid_${user.id}"]`).remove();

  //Step2 : remove right side
  $("#screen-chat").find(`div#to_${user.id}`).remove();

  //Step3 : remove image modal
  $("body").find(`div#imagesModal_${user.id}`).remove();

  //Step4 : remove attactment modal
  $("body").find(`div#attachmentsModal_${user.id}`).remove();
  //Step5: click conversation first
  if (checkActive) {
    if ($("ul.people").find("a").length) {
      $("ul.people").find("a")[0].click();
    }
  }
});

$(document).ready(function () {
  removeContact();
});
