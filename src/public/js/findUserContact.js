function callFindUsers(element) {
  if (element.which === 13 || element.type === "click") {
    let keyword = $("#input-find-users-contact").val();
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

    $.get(`/contact/find-users/${keyword}`, function (data) {
      $("#find-user ul").html(data);
      addContact(); //addContact.js
      removeRequestContact(); //removeRequestContact.js
    });
  }
}

$(document).ready(function () {
  $("#input-find-users-contact").bind("keypress", callFindUsers);
  $("#btn-find-users-contact").bind("click", callFindUsers);
});
