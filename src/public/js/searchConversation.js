function searchConversation() {
  $("#input-search-conversation").bind("keypress", function (element) {
    if (element.which === 13) {
      let keyword = $("#input-search-conversation").val();
      let regexKeyword = new RegExp(
        /^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
      );

      if (!keyword.length) {
        alertify.notify("Chưa nhập nội dung tìm kiếm.", "error", 7);
        return false;
      }

      if (!regexKeyword.test(keyword)) {
        alertify.notify(
          "Lỗi từ khóa tìm kiếm, chỉ cho phép kí tự chữ cái và số. Cho phép khoảng trống.",
          "error",
          7
        );
        return false;
      }

      $.get(`/conversation/search/${keyword}`, function (data) {
        $("#search-results").find("ul").html(data);
        $("#search-results").css("display", "block");

        $(document).click(function () {
          $("#search-results").css("display", "none");
        });

        $("#search-results")
          .find("li")
          .bind("click", function () {
            let dataChat = $(this).data("chat");
            $("ul.people").find(`a[href="#uid_${dataChat}"]`).click();
          });
      });
    }
  });
}

$(document).ready(function () {
  searchConversation();
});
